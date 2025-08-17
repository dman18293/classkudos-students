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
    const { teacherEmail } = event.queryStringParameters || {};
    
    if (!teacherEmail) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing teacherEmail parameter' })
      };
    }

    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    
    // Get students for this teacher, grouped by class
    const res = await client.query(`
      SELECT class, 
             json_agg(json_build_object(
               'id', id,
               'name', name,
               'points', points,
               'avatar', avatar
             ) ORDER BY name) as students
      FROM students 
      WHERE teacher_email = $1 
      GROUP BY class
      ORDER BY class
    `, [teacherEmail]);

    await client.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        classes: res.rows
      })
    };

  } catch (error) {
    console.error('Error getting students for teacher:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error: ' + error.message })
    };
  }
};
