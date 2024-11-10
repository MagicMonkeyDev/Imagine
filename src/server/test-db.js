const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Starting connection attempt...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('Connected successfully to MongoDB');
    
    // Test the connection with a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections);
    
  } catch (error) {
    console.error('Connection error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
  } finally {
    await mongoose.disconnect();
  }
}

testConnection(); 