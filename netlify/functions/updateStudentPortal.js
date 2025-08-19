const { Client } = require('pg');

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

  let client;

  try {
    const body = JSON.parse(event.body);
    console.log('Update request body:', body);
    
    const { studentId, avatar, xp, level, achievements, stats } = body;
    
    if (!studentId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Student ID is required' })
      };
    }

    // Connect to database
    client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
    });
    
    await client.connect();
    console.log('Connected to database for student portal update');

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (avatar) {
      updates.push(`avatar_data = $${paramCount}`);
      values.push(JSON.stringify(avatar));
      paramCount++;
    }

    if (xp !== undefined) {
      updates.push(`xp = $${paramCount}`);
      values.push(xp);
      paramCount++;
    }

    if (level !== undefined) {
      updates.push(`level = $${paramCount}`);
      values.push(level);
      paramCount++;
    }

    if (achievements) {
      updates.push(`achievements = $${paramCount}`);
      values.push(JSON.stringify(achievements));
      paramCount++;
    }

    if (stats) {
      updates.push(`stats = $${paramCount}`);
      values.push(JSON.stringify(stats));
      paramCount++;
    }

    if (updates.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No valid fields to update' })
      };
    }

    // Add student ID as the last parameter
    values.push(studentId);
    
    const query = `
      UPDATE students 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
    `;

    console.log('Executing update query:', query);
    console.log('With values:', values);

    const result = await client.query(query, values);
    
    if (result.rowCount === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Student not found' })
      };
    }

    console.log('Student portal updated successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Student portal updated successfully',
        updatedFields: updates.length
      })
    };

  } catch (error) {
    console.error('Error updating student portal:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      })
    };
  } finally {
    if (client) {
      await client.end();
    }
  }
};