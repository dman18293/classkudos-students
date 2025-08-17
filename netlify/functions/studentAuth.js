const { Client } = require('pg');

exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
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

    const { classCode, studentName } = JSON.parse(event.body);
    
    if (!classCode || !studentName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing classCode or studentName' })
      };
    }

    await client.connect();
    
    // Find student by class code and name (case insensitive)
    const res = await client.query(
      'SELECT id, name, class, points, avatar FROM students WHERE class = $1 AND LOWER(name) = LOWER($2)',
      [classCode, studentName]
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
          avatar: student.avatar
        }
      })
    };

  } catch (error) {
    console.error('Error authenticating student:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error: ' + error.message })
    };
  }
};
