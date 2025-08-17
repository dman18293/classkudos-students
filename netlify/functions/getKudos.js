const { Client } = require('pg');

exports.handler = async function(event, context) {
  try {
    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    // Authenticate teacher via JWT
    const authHeader = event.headers['authorization'] || event.headers['Authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }
    const jwt = require('jsonwebtoken');
    const token = authHeader.replace('Bearer ', '');
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'changeme');
    } catch (e) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid token' }) };
    }
    const teacher_email = decoded.email;

    await client.connect();
    // Get only students for this teacher - INCLUDING present field
    const res = await client.query('SELECT id, name, class, points, present, summary_log, teacher_email FROM students WHERE teacher_email = $1', [teacher_email]);
    await client.end();
    return {
      statusCode: 200,
      body: JSON.stringify(res.rows)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
