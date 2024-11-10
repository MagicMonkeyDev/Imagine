const { MongoClient } = require('mongodb');

const username = "dezyvx";
const password = "MZjMxRNYXdRjvh9P";
const dbName = "ai-thoughts";

const uri = `mongodb://${username}:${password}@ac-qqvpwxj-shard-00-00.im9ba.mongodb.net:27017,ac-qqvpwxj-shard-00-01.im9ba.mongodb.net:27017,ac-qqvpwxj-shard-00-02.im9ba.mongodb.net:27017/${dbName}?ssl=true&replicaSet=atlas-qr9vdj-shard-0&authSource=admin`;

const client = new MongoClient(uri, {
    ssl: true,
    serverSelectionTimeoutMS: 15000,
});

async function run() {
    try {
        console.log('Attempting to connect...');
        await client.connect();
        console.log('Connected successfully!');
        
        const db = client.db(dbName);
        const result = await db.command({ ping: 1 });
        console.log('Database ping result:', result);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
    }
}

run(); 