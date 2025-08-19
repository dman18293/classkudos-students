const { Client } = require('pg');

// Generate consistent student ID using the same hash function as main app
function generateConsistentStudentId(name) {
    // Generate a simple 4-digit code based on the student's name
    // This ensures the same student always gets the same ID
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

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }

    try {
        const client = new Client({
            connectionString: process.env.NETLIFY_DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });

        await client.connect();
        
        // Get all students from ALL classes to see what's actually in the database
        const allStudents = await client.query('SELECT id, name, class, teacher_email FROM students ORDER BY class, teacher_email');
        
        // Get students from DARR class specifically
        const darrStudents = await client.query('SELECT id, name, class, teacher_email FROM students WHERE UPPER(class) = $1', ['DARR']);
        
        await client.end();

        // Generate codes for DARR students
        const darrWithCodes = darrStudents.rows.map(student => ({
            id: student.id,
            name: student.name,
            class: student.class,
            teacher_email: student.teacher_email,
            generatedCode: generateConsistentStudentId(student.name)
        }));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                totalStudents: allStudents.rows.length,
                allStudents: allStudents.rows,
                darrStudents: darrWithCodes
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: error.message
            })
        };
    }
};
