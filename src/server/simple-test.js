const mongoose = require('mongoose');
require('dotenv').config();

// Get the connection string
const uri = process.env.MONGODB_URI;

// Remove sensitive info before logging
const sanitizedUri = uri.replace(/:([^@]+)@/, ':****@');
console.log('Attempting to connect with:', sanitizedUri);

mongoose.connect(uri)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    return mongoose.connection.db.listCollections().toArray();
  })
  .then(collections => {
    console.log('Available collections:', collections);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Connection error:', err);
    mongoose.disconnect();
  }); 