// Database connection setup using Mongoose with resilient DNS resolution
const dns = require('dns');
const mongoose = require('mongoose');

// Configure reliable DNS servers to ensure MongoDB Atlas SRV records resolve smoothly on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  // Fallback to system default DNS if setServers is restricted
}

// Disable buffering so queries fail fast when database is offline
mongoose.set('bufferCommands', false);

let isConnected = false;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/careerconnect';

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });

    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.error(`Database Connection Notice: ${error.message}`);
    console.log(`Tip: If MongoDB is not running locally, update MONGODB_URI in server/.env with your MongoDB Atlas cluster connection string.`);
  }
};

const getDbStatus = () => isConnected || mongoose.connection.readyState === 1;

module.exports = { connectDB, getDbStatus };
