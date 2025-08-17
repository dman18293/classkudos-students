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
    const { classCode } = event.queryStringParameters || {};
    
    if (!classCode) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing classCode parameter' })
      };
    }

    // Return demo leaderboard data
    const leaderboard = [
      {
        rank: 1,
        studentId: 1,
        name: 'Demo Student 1',
        points: 100,
        avatar: null
      },
      {
        rank: 2,
        studentId: 2,
        name: 'Demo Student 2',
        points: 75,
        avatar: null
      },
      {
        rank: 3,
        studentId: 3,
        name: 'Demo Student 3',
        points: 50,
        avatar: null
      }
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        leaderboard: leaderboard
      })
    };

  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error: ' + error.message })
    };
  }
};
