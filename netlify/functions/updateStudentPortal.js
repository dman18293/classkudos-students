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
        const { studentId, avatarData } = JSON.parse(event.body);
        
        if (!studentId || !avatarData) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing studentId or avatarData' })
            };
        }

        const client = await connectToDatabase();
        const db = client.db('classkudos');
        const collection = db.collection('students');

        // Update the student's avatar
        const result = await collection.updateOne(
            { studentId: parseInt(studentId) },
            { 
                $set: { 
                    avatar: avatarData,
                    lastUpdated: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
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
                message: 'Avatar updated successfully',
                modifiedCount: result.modifiedCount
            })
        };

    } catch (error) {
        console.error('Error updating student avatar:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
