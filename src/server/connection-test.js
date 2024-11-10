const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    // Log the connection string (remove password before sharing)
    const connectionString = process.env.MONGODB_URI;
    console.log('Connection string:', connectionString.replace(/:([^@]+)@/, ':****@'));
    
    // Log IP whitelist status
    console.log('Checking connection...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // Increase timeout to 10 seconds
    });
    
    console.log('Successfully connected to MongoDB!');
    
    // Test database operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections);
    
  } catch (error) {
    console.error('Detailed error information:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    
    // Additional debugging information
    if (error.name === 'MongooseServerSelectionError') {
      console.log('\nPossible issues:');
      console.log('1. IP Whitelist: Check MongoDB Atlas Network Access');
      console.log('2. Credentials: Verify username and password');
      console.log('3. Cluster Status: Check if cluster is active');
      console.log('4. Network: Check your internet connection');
    }
  } finally {
    await mongoose.disconnect();
  }
}

// Run the test
console.log('Starting connection test...');
testConnection(); 