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
    // Test basic database connection
    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    
    // Simple test query
    const res = await client.query('SELECT NOW() as current_time');
    
    await client.end();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Database connection successful',
        timestamp: res.rows[0].current_time,
        env_check: {
          has_database_url: !!process.env.NETLIFY_DATABASE_URL,
          url_length: process.env.NETLIFY_DATABASE_URL ? process.env.NETLIFY_DATABASE_URL.length : 0
        }
      })
    };
    
  } catch (error) {
    console.error('Database test error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Database connection failed',
        details: error.message,
        env_check: {
          has_database_url: !!process.env.NETLIFY_DATABASE_URL,
          url_length: process.env.NETLIFY_DATABASE_URL ? process.env.NETLIFY_DATABASE_URL.length : 0
        }
      })
    };
  }
};
