const { Client } = require('pg');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    
    // Get sample students and their classes
    const res = await client.query(`
      SELECT id, name, class, points
      FROM students 
      LIMIT 10
    `);

    await client.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        sample_students: res.rows,
        instructions: {
          class_codes: "Use UPPER(REPLACE(class, ' ', '')) format",
          student_codes: "Use the 'id' field as student code"
        }
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Database error: ' + error.message })
    };
  }
};
