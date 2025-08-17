const { Client } = require('pg');

/**
 * Authenticates a student using their login code and returns their data
 */
exports.handler = async function(event) {
  let client;
  try {
    // Enable CORS for student portal
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const { loginCode, className } = JSON.parse(event.body || '{}');
    if (!loginCode || !className) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'loginCode and className are required' }) };
    }

    client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 5000,
      query_timeout: 15000
    });
    
    await client.connect();

    // Find student by login code and class
    const result = await client.query(`
      SELECT id, name, class, points, xp, level, avatar_data, stats_data, login_code, teacher_email
      FROM students 
      WHERE login_code = $1 AND class = $2
      LIMIT 1
    `, [loginCode, className]);

    if (result.rows.length === 0) {
      await client.end();
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Invalid login code or class' }) };
    }

    const student = result.rows[0];
    
    // Parse JSON fields
    let avatarData = null;
    let statsData = null;
    
    try {
      if (student.avatar_data) avatarData = JSON.parse(student.avatar_data);
    } catch (e) {
      console.warn('Failed to parse avatar_data for student:', student.name);
    }
    
    console.log('Parsed avatar data:', avatarData);
    console.log('Avatar validation - has avatarData:', !!avatarData);
    console.log('Avatar validation - is object:', typeof avatarData === 'object');
    console.log('Avatar validation - has body:', !!avatarData?.body);
    console.log('Avatar validation - has creatureType:', !!avatarData?.creatureType);
    
    try {
      if (student.stats_data) statsData = JSON.parse(student.stats_data);
    } catch (e) {
      console.warn('Failed to parse stats_data for student:', student.name);
    }

    // Generate default avatar if none exists or is invalid
    if (!avatarData || typeof avatarData !== 'object' || (!avatarData.body && !avatarData.creatureType)) {
      console.log('Generating default avatar because validation failed');
      avatarData = generateDefaultAvatar(student.name);
      
      // Save the default avatar to database
      await client.query(`
        UPDATE students 
        SET avatar_data = $1 
        WHERE id = $2
      `, [JSON.stringify(avatarData), student.id]);
    } else {
      console.log('Using existing avatar data:', avatarData);
    }

    // Generate default stats if none exist
    if (!statsData) {
      statsData = {
        questionsAnswered: 0,
        accuracy: 0,
        assignmentsCompleted: 0,
        averageScore: 0
      };
      
      // Save default stats to database
      await client.query(`
        UPDATE students 
        SET stats_data = $1 
        WHERE id = $2
      `, [JSON.stringify(statsData), student.id]);
    }

    await client.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        student: {
          id: student.id,
          name: student.name,
          className: student.class,
          kudosPoints: student.points || 0,
          xp: student.xp || 0,
          level: student.level || 1,
          avatar: avatarData,
          stats: statsData,
          teacherEmail: student.teacher_email
        }
      })
    };

  } catch (error) {
    console.error('Student auth error:', error.message);
    if (client) {
      try {
        await client.end();
      } catch (endError) {
        console.error('Error closing client:', endError.message);
      }
    }
    return { statusCode: 500, headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }, body: JSON.stringify({ error: error.message }) };
  }
};

function generateDefaultAvatar(studentName) {
  // Generate a default robot avatar similar to the main app
  const colors = ["#FFB6C1", "#DEB887", "#F4A460", "#FFDBAC", "#98FB98", "#87CEEB", "#DDA0DD", "#F0E68C"];
  const hairColors = ["#8B4513", "#000000", "#FF4500", "#4B0082", "#FFD700", "#DC143C"];
  const clothesColors = ["#4169E1", "#FF69B4", "#32CD32", "#000080", "#FF6347", "#9370DB"];
  
  // Use student name to generate consistent but varied avatar
  const nameHash = studentName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return {
    body: "robot", // Set to robot as requested
    color: colors[Math.abs(nameHash) % colors.length],
    hair: "short",
    hairColor: hairColors[Math.abs(nameHash * 2) % hairColors.length],
    eyes: "happy",
    clothes: "tshirt",
    clothesColor: clothesColors[Math.abs(nameHash * 3) % clothesColors.length]
  };
}
