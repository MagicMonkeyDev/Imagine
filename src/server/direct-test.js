const mongoose = require('mongoose');
require('dotenv').config();

// Use direct connection string with all replica set members
const username = "dezyvx";
const password = "MZjMxRNYXdRjvh9P";
const dbName = "ai-thoughts";

const uri = `mongodb://${username}:${password}@ac-qqvpwxj-shard-00-00.im9ba.mongodb.net:27017,ac-qqvpwxj-shard-00-01.im9ba.mongodb.net:27017,ac-qqvpwxj-shard-00-02.im9ba.mongodb.net:27017/${dbName}?ssl=true&replicaSet=atlas-qr9vdj-shard-0&authSource=admin`;

console.log('Attempting connection with direct URLs...');

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
    ssl: true,
})
.then(() => {
    console.log('Connected successfully!');
    return mongoose.connection.db.admin().ping();
})
.then(() => {
    console.log('Database ping successful!');
    return mongoose.disconnect();
})
.catch(err => {
    console.error('Connection failed:', err.message);
    console.error('Full error:', err);
}); 