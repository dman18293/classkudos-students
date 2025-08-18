const { Client } = require('pg');

exports.handler = async function(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request
    const requestBody = JSON.parse(event.body);
    const { classCode, studentCode } = requestBody;
    
    console.log('New auth attempt:', { classCode, studentCode });

    // Validate input
    if (!classCode || !studentCode) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          required: ['classCode', 'studentCode']
        })
      };
    }

    // Connect to Neon database
    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    console.log('Database connected successfully');

    // Simple query - find student by ID and class
    const query = `
      SELECT id, name, class, points, avatar_data as avatar 
      FROM students 
      WHERE CAST(id AS TEXT) = $1 
      AND UPPER(TRIM(class)) LIKE UPPER(TRIM($2)) || '%'
    `;
    
    console.log('Executing query with:', [studentCode, classCode]);
    const result = await client.query(query, [studentCode, classCode]);
    
    await client.end();
    console.log('Query completed, rows found:', result.rows.length);

    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          error: 'Student not found',
          message: `No student with code ${studentCode} found in class ${classCode}`
        })
      };
    }

    // Success
    const student = result.rows[0];
    console.log('Student found:', { id: student.id, name: student.name, class: student.class });
    
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
    console.error('Authentication error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Server error',
        message: error.message
      })
    };
  }
};
