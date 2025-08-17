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

  try {
    // For demo purposes, return some sample student data
    const sampleStudents = [
      {
        id: 1,
        name: 'Demo Student',
        class: 'Demo Class',
        points: 50,
        present: true,
        summary_log: 'Great participation!',
        teacher_email: 'demo@example.com'
      }
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(sampleStudents)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
