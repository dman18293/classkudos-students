/**
 * Simple function to return mock teachers for student login
 * No external dependencies to avoid package.json issues
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
    // Return a simple list of teachers
    // In a real scenario, this would connect to your database
    const teachers = [
      {
        email: 'damienmdarr@gmail.com',
        name: 'Mr. Darr',
        class_count: 1
      }
    ];
    
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
        details: error.message 
      })
    };
  }
};
