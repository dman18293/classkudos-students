const { Client } = require('pg');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { classCode, studentCode } = JSON.parse(event.body);
    
    console.log('Debug - Input:', { classCode, studentCode });

    if (!classCode || !studentCode) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing classCode or studentCode' })
      };
    }

    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    
    // First, let's see what students exist for debugging
    const allRes = await client.query(`
      SELECT id, name, class, points, avatar 
      FROM students 
      LIMIT 5
    `);
    
    console.log('Debug - Sample students:', allRes.rows);
    
    // Now try to find the student
    const res = await client.query(`
      SELECT id, name, class, points, avatar 
      FROM students 
      WHERE (
        LOWER(class) = LOWER($1) OR 
        REPLACE(REPLACE(LOWER(class), ' ', ''), '-', '') = LOWER($1)
      )
      AND CAST(id AS TEXT) = $2
    `, [classCode, studentCode]);

    console.log('Debug - Query result:', { 
      classCode, 
      studentCode, 
      matchCount: res.rows.length,
      matches: res.rows 
    });

    await client.end();

    if (res.rows.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          error: 'Student not found',
          details: `No student with code "${studentCode}" found in class "${classCode}"`,
          debug: {
            classCodeSearched: classCode,
            studentCodeSearched: studentCode,
            sampleStudents: allRes.rows
          }
        })
      };
    }

    const student = res.rows[0];
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        student: {
          id: student.id,
          name: student.name,
          class: student.class,
          classCode: classCode,
          points: student.points || 0,
          avatar: student.avatar
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
