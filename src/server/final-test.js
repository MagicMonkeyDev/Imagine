const mongoose = require('mongoose');
require('dotenv').config();

// Construct the connection string manually
const username = "dezyvx";
const password = "MZjMxRNYXdRjvh9P";
const cluster = "cluster0.im9ba.mongodb.net";
const dbName = "ai-thoughts";

const uri = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;

console.log('Attempting connection...');

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000, // Increase timeout
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
    if (err.message.includes('Authentication failed')) {
        console.log('\nPossible authentication issue - please verify username and password');
    }
}); 