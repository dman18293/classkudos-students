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

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { classCode } = event.queryStringParameters || {};
        
        if (!classCode) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing classCode parameter' })
            };
        }

        const client = await connectToDatabase();
        const db = client.db('classkudos');
        const collection = db.collection('students');

        // Get all students in the class, sorted by points
        const students = await collection.find({ class: classCode })
            .sort({ points: -1 })
            .toArray();

        const leaderboard = students.map((student, index) => ({
            rank: index + 1,
            studentId: student.studentId,
            name: student.name,
            points: student.points || 0,
            avatar: student.avatar || null
        }));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                leaderboard: leaderboard
            })
        };

    } catch (error) {
        console.error('Error getting leaderboard:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
