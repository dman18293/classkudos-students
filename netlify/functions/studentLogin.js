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
    const { classCode, studentCode, studentName } = JSON.parse(event.body);
    
    // Accept either studentCode (new) or studentName (old) for compatibility
    const studentIdentifier = studentCode || studentName;
    
    if (!classCode || !studentIdentifier) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing classCode or studentCode' })
      };
    }

    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    
    // Find student by class code and student code (using ID as student code)
    // Support both exact class name match and simplified class codes
    const res = await client.query(`
      SELECT id, name, class, points, avatar_data as avatar 
      FROM students 
      WHERE (
        LOWER(class) = LOWER($1) OR 
        REPLACE(REPLACE(LOWER(class), ' ', ''), '-', '') = LOWER($1)
      )
      AND CAST(id AS TEXT) = $2
    `, [classCode, studentIdentifier]);

    await client.end();

    if (res.rows.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          error: 'Student not found',
          details: `No student with code "${studentIdentifier}" found in class "${classCode}"`
        })
      };
    }

    const student = res.rows[0];
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        student: {
          id: student.id,
          name: student.name,
          class: student.class,
          classCode: classCode, // Return the code they used
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
