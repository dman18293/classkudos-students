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
    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    const { studentId } = event.queryStringParameters || {};
    
    if (!studentId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing studentId parameter' })
      };
    }

    await client.connect();
    
    // Get student data
    const res = await client.query(
      'SELECT id, name, class, points, avatar, summary_log FROM students WHERE id = $1',
      [studentId]
    );

    await client.end();

    if (res.rows.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Student not found' })
      };
    }

    const student = res.rows[0];
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        student: {
          studentId: student.id,
          name: student.name,
          class: student.class,
          points: student.points || 0,
          avatar: student.avatar,
          summary_log: student.summary_log || []
        }
      })
    };

  } catch (error) {
    console.error('Error getting student data:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error: ' + error.message })
    };
  }
};
