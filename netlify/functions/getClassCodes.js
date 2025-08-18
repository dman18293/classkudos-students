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
    return { statusCode: 200, headers, body: '' };
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

    await client.connect();
    
    // Get all unique classes with their simplified codes
    const res = await client.query(`
      SELECT DISTINCT 
        class as full_name,
        REPLACE(REPLACE(UPPER(class), ' ', ''), '-', '') as class_code,
        COUNT(*) as student_count
      FROM students 
      GROUP BY class
      ORDER BY class
    `);

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
    console.error('Error getting class codes:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to get class codes',
        details: error.message
      })
    };
  }
};
