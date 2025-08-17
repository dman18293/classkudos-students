const { Client } = require('pg');

exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { classCode } = event.queryStringParameters || {};
    
    if (!classCode) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing classCode parameter' })
      };
    }

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    
    // Get all students in the class, sorted by points
    const res = await client.query(
      'SELECT id, name, points, avatar FROM students WHERE class = $1 ORDER BY points DESC',
      [classCode]
    );

    await client.end();

    const leaderboard = res.rows.map((student, index) => ({
      rank: index + 1,
      studentId: student.id,
      name: student.name,
      points: student.points || 0,
      avatar: student.avatar
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        leaderboard: leaderboard
      })
    };

  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error: ' + error.message })
    };
  }
};
