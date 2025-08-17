const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) {
        return cachedClient;
    }
    
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    return client;
}

exports.handler = async (event, context) => {
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

        const client = await connectToDatabase();
        const db = client.db('classkudos');
        const collection = db.collection('students');

        // Find student by class code and name
        const student = await collection.findOne({
            class: classCode,
            name: { $regex: new RegExp(`^${studentName}$`, 'i') }
        });

        if (!student) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Student not found' })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                student: {
                    studentId: student.studentId,
                    name: student.name,
                    class: student.class,
                    points: student.points || 0,
                    avatar: student.avatar || null
                }
            })
        };

    } catch (error) {
        console.error('Error authenticating student:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
