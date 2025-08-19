const { Client } = require('pg');

// Same function as main app - generates consistent student ID from name
function generateConsistentStudentId(name) {
  let hash = 0;
  if (name.length === 0) return "1000";
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Convert to 4-digit code (1000-9999)
  const code = (Math.abs(hash) % 9000) + 1000;
  return code.toString();
}

exports.handler = async function(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight
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
    // Parse request
    const requestBody = JSON.parse(event.body);
    const { classCode, studentCode } = requestBody;
    
    console.log('Consistent auth attempt:', { classCode, studentCode });

    // Validate input
    if (!classCode || !studentCode) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          required: ['classCode', 'studentCode']
        })
      };
    }

    // Connect to database
    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    console.log('Database connected successfully');

    // Get all students from the class
    const query = `
      SELECT id, name, class, points, avatar_data as avatar, teacher_email
      FROM students 
      WHERE (
        UPPER(TRIM(class)) LIKE UPPER(TRIM($1)) || '%' OR
        UPPER(TRIM(class)) LIKE '%' || UPPER(TRIM($1)) || '%'
      )
    `;
    
    console.log('Executing query with classCode:', classCode);
    const result = await client.query(query, [classCode]);
    
    await client.end();
    console.log('Query completed, total students found:', result.rows.length);

    // Find student by matching generated student code to their name
    const matchingStudent = result.rows.find(student => {
      const generatedCode = generateConsistentStudentId(student.name);
      console.log(`Student ${student.name}: generated code ${generatedCode}, looking for ${studentCode}`);
      return generatedCode === studentCode;
    });

    if (!matchingStudent) {
      console.log('No matching student found');
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          error: 'Student not found',
          message: `No student with code ${studentCode} found in class ${classCode}`,
          debug: `Checked ${result.rows.length} students in class`
        })
      };
    }

    // Success
    console.log('Student found:', { name: matchingStudent.name, class: matchingStudent.class });
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        student: {
          studentId: matchingStudent.id,
          name: matchingStudent.name,
          class: matchingStudent.class,
          points: matchingStudent.points || 0,
          avatar: matchingStudent.avatar,
          displayCode: studentCode // The 4-digit code they used to login
        }
      })
    };

  } catch (error) {
    console.error('Authentication error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Server error',
        message: error.message
      })
    };
  }
};
