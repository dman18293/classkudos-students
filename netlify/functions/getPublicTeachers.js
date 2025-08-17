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
    // First, check if we have the environment variable
    if (!process.env.NETLIFY_DATABASE_URL) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Missing database configuration',
          details: 'NETLIFY_DATABASE_URL environment variable not set'
        })
      };
    }

    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    console.log('Attempting to connect to database...');
    await client.connect();
    console.log('Connected successfully');
    
    // Test basic query first
    console.log('Testing basic query...');
    const testRes = await client.query('SELECT 1 as test');
    console.log('Basic query successful:', testRes.rows);
    
    // Check if teachers table exists
    console.log('Checking if teachers table exists...');
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'teachers'
      );
    `);
    console.log('Teachers table exists:', tableCheck.rows[0].exists);
    
    if (!tableCheck.rows[0].exists) {
      await client.end();
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Teachers table does not exist',
          details: 'Database setup may be incomplete'
        })
      };
    }

    // Simple query to get teachers
    console.log('Querying teachers...');
    const res = await client.query(`
      SELECT email, display_name as name
      FROM teachers
      ORDER BY display_name
      LIMIT 5
    `);
    console.log('Teachers query result:', res.rows);

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
    console.error('Detailed error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to get teachers',
        details: error.message,
        stack: error.stack,
        env_check: {
          has_database_url: !!process.env.NETLIFY_DATABASE_URL,
          url_preview: process.env.NETLIFY_DATABASE_URL ? 
            process.env.NETLIFY_DATABASE_URL.substring(0, 20) + '...' : 'missing'
        }
      })
    };
  }
};
