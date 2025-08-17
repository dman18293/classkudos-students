const { Client } = require('pg');

/**
 * Get list of teachers for student login selection
 */
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
    
    // Simple query first - just get all teachers
    const res = await client.query(`
      SELECT email, display_name as name
      FROM teachers
      ORDER BY display_name
    `);

    await client.end();
    
    // Add a class_count of 1 for each teacher for now
    const teachers = res.rows.map(teacher => ({
      ...teacher,
      class_count: 1
    }));
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(teachers)
    };
    
  } catch (error) {
    console.error('Error getting teachers:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to get teachers',
        details: error.message,
        stack: error.stack
      })
    };
  }
};
