const { Client } = require('pg');

// Generate consistent student ID using the same hash function as main app
function generateConsistentStudentId(name) {
    let hash = 0;
    const str = name.toLowerCase().trim();
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    // Ensure it's always a 4-digit number between 1000-9999
    return Math.abs(hash % 9000) + 1000;
}

exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ success: false, message: 'Method not allowed' })
        };
    }

    try {
        const { classCode, studentCode } = JSON.parse(event.body);
        
        console.log('Auth attempt:', { classCode, studentCode });

        if (!classCode || !studentCode) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Missing classCode or studentCode'
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

        // Get all students from the specified class
        const query = `
            SELECT s.id, s.name 
            FROM students s 
            JOIN classes c ON s.class_id = c.id 
            WHERE UPPER(c.class_code) = UPPER($1)
        `;
        
        const result = await client.query(query, [classCode]);
        console.log(`Found ${result.rows.length} students for class ${classCode}`);

        if (result.rows.length === 0) {
            await client.end();
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Class not found'
                })
            };
        }

        // Generate student codes for all students and find match
        let matchedStudent = null;
        for (const student of result.rows) {
            const generatedCode = generateConsistentStudentId(student.name);
            console.log(`Student: ${student.name}, Generated Code: ${generatedCode}, Input Code: ${studentCode}`);
            
            if (generatedCode.toString() === studentCode.toString()) {
                matchedStudent = student;
                break;
            }
        }

        await client.end();

        if (matchedStudent) {
            console.log('Authentication successful for:', matchedStudent);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    student: matchedStudent,
                    message: 'Authentication successful'
                })
            };
        } else {
            console.log('No matching student found for code:', studentCode);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Invalid student code for this class'
                })
            };
        }

    } catch (error) {
        console.error('Authentication error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Server error during authentication'
            })
        };
    }
};
