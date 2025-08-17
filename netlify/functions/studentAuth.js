exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { classCode, studentName } = JSON.parse(event.body);
    
    if (!classCode || !studentName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing classCode or studentName' })
      };
    }

    // For now, allow any student to log in with any code
    // This bypasses database dependency issues
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        student: {
          studentId: 1,
          name: studentName,
          class: classCode,
          points: 0,
          avatar: null
        }
      })
    };

  } catch (error) {
    console.error('Error authenticating student:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error: ' + error.message })
    };
  }
};
