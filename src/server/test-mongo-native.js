const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function testNativeConnection() {
  try {
    console.log('Attempting to connect using native driver...');
    await client.connect();
    console.log('Connected successfully using native driver');
    
    const dbList = await client.db().admin().listDatabases();
    console.log('Databases:', dbList);
    
  } catch (error) {
    console.error('Native driver error:', error);
  } finally {
    await client.close();
  }
}

testNativeConnection(); 