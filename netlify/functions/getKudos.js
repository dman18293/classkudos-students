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

  try {
    const { studentId, classCode } = event.queryStringParameters || {};
    
    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    
    if (studentId) {
      // Get specific student's data and parse their activities from summary_log
      const studentRes = await client.query(
        'SELECT id, name, class, points, present, summary_log, COALESCE(avatar_data, \'\') as avatar_data, COALESCE(xp, points) as xp, COALESCE(level, 1) as level FROM students WHERE id = $1', 
        [studentId]
      );
      
      if (studentRes.rows.length === 0) {
        await client.end();
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, error: 'Student not found' })
        };
      }
      
      const student = studentRes.rows[0];
      
      // Parse activities from summary_log if it exists
      let activities = [];
      if (student.summary_log) {
        try {
          // Try to parse as JSON first (newer format)
          const parsed = JSON.parse(student.summary_log);
          if (Array.isArray(parsed)) {
            activities = parsed;
          } else if (parsed.activities && Array.isArray(parsed.activities)) {
            activities = parsed.activities;
          }
        } catch (e) {
          // If not JSON, it might be a simple text log
          // Create a single activity from the text
          activities = [{
            type: 'add',
            points: student.points,
            reason: student.summary_log,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString()
          }];
        }
      }
      
      await client.end();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          student: student,
          kudos: activities.map(activity => ({
            points: activity.points || 1,
            reason: activity.reason || 'Great work!',
            description: activity.description || '',
            date_awarded: activity.timestamp || activity.date,
            created_at: activity.timestamp || activity.date
          }))
        })
      };
    } else if (classCode) {
      // Get all students in a class
      const res = await client.query(
        'SELECT id, name, class, points, present, summary_log, COALESCE(avatar_data, \'\') as avatar_data, COALESCE(xp, points) as xp, COALESCE(level, 1) as level FROM students WHERE class = $1 ORDER BY points DESC, name', 
        [classCode]
      );
      
      await client.end();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true,
          students: res.rows 
        })
      };
    } else {
      await client.end();
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Missing studentId or classCode parameter' })
      };
    }
  } catch (error) {
    console.error('Error getting student data:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
