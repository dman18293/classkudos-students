const { Client } = require('pg');

/**
 * Gets leaderboard data for a specific class
 */
exports.handler = async function(event) {
  let client;
  try {
    if (event.httpMethod !== 'GET') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const { className, teacherEmail } = event.queryStringParameters || {};
    if (!className) {
      return { statusCode: 400, body: JSON.stringify({ error: 'className is required' }) };
    }

    client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 5000,
      query_timeout: 15000
    });
    
    await client.connect();

    // Get all students for the class, optionally filtered by teacher
    let query = `
      SELECT id, name, points, xp, level, avatar_data 
      FROM students 
      WHERE class = $1
    `;
    let queryParams = [className];

    if (teacherEmail) {
      query += ` AND teacher_email = $2`;
      queryParams.push(teacherEmail);
    }

    query += ` ORDER BY points DESC, xp DESC, level DESC`;

    const result = await client.query(query, queryParams);

    const leaderboard = result.rows.map(student => {
      let avatarData = null;
      try {
        if (student.avatar_data) {
          avatarData = JSON.parse(student.avatar_data);
        }
      } catch (e) {
        console.warn('Failed to parse avatar_data for student:', student.name);
      }
      
      // Ensure we always have a valid avatar object
      if (!avatarData || typeof avatarData !== 'object' || !avatarData.body) {
        avatarData = {
          body: "robot",
          color: "#667eea",
          hair: "short",
          hairColor: "#8B4513",
          eyes: "happy",
          clothes: "tshirt",
          clothesColor: "#4169E1"
        };
      }

      return {
        id: student.id,
        name: student.name,
        points: student.points || 0,
        xp: student.xp || 0,
        level: student.level || 1,
        avatar: avatarData
      };
    });

    await client.end();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET'
      },
      body: JSON.stringify({
        success: true,
        leaderboard,
        className
      })
    };

  } catch (error) {
    console.error('Leaderboard error:', error.message);
    if (client) {
      try {
        await client.end();
      } catch (endError) {
        console.error('Error closing client:', endError.message);
      }
    }
    return { 
      statusCode: 500, 
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message }) 
    };
  }
};
