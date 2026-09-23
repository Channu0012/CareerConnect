// Database connection setup using Mongoose
const mongoose = require('mongoose');

// Disable buffering so Mongoose operations fail fast when the DB is offline instead of stalling
mongoose.set('bufferCommands', false);

let isConnected = false;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/careerconnect';

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds instead of hanging
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
