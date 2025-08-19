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
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    
    // Get leaderboard for the specified class - handle missing columns gracefully
    const res = await client.query(
      'SELECT id, name, points, COALESCE(avatar_data, \'\') as avatar_data, COALESCE(xp, points) as xp, COALESCE(level, 1) as level FROM students WHERE class = $1 ORDER BY points DESC',
      [classCode]
    );

    await client.end();

    const leaderboard = res.rows.map((student, index) => ({
      rank: index + 1,
      id: student.id,
      name: student.name,
      total_points: student.points || 0,
      avatar_data: student.avatar_data
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
