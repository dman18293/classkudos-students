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
    
    // Get teachers who have students (active classes)
    const res = await client.query(`
      SELECT DISTINCT t.email, t.display_name as name, 
             COUNT(DISTINCT s.class) as class_count
      FROM teachers t
      JOIN students s ON s.teacher_email = t.email
      GROUP BY t.email, t.display_name
      ORDER BY t.display_name
    `);

    await client.end();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(res.rows)
    };
    
  } catch (error) {
    console.error('Error getting teachers:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to get teachers',
        details: error.message 
      })
    };
  }
};
