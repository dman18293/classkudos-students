const { Client } = require('pg');

exports.handler = async (event, context) => {
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
        // Test 1: Basic response
        console.log('Function called successfully');
        
        // Test 2: Parse body
        let requestData;
        try {
            requestData = JSON.parse(event.body);
            console.log('Request data:', requestData);
        } catch (parseError) {
            console.error('Parse error:', parseError);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, message: 'Invalid JSON in request body' })
            };
        }

        const { classCode, studentCode } = requestData;
        
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

        // Test 3: Database connection
        console.log('Testing database connection...');
        const client = new Client({
            connectionString: process.env.NETLIFY_DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });

        await client.connect();
        console.log('Database connected successfully');

        // Test simple query first
        const testQuery = 'SELECT 1 as test';
        const testResult = await client.query(testQuery);
        console.log('Test query result:', testResult.rows);

        await client.end();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Test successful',
                received: { classCode, studentCode },
                dbTest: testResult.rows[0]
            })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Server error: ' + error.message,
                stack: error.stack
            })
        };
    }
};
