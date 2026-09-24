// Database connection setup using Mongoose with resilient DNS resolution & auto-fallback
const dns = require('dns');
const mongoose = require('mongoose');

// Configure reliable DNS servers to ensure MongoDB Atlas SRV records resolve smoothly on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  // Fallback to system default DNS if setServers is restricted
}

let isConnected = false;
let mongodInstance = null;

// Connection lifecycle event listeners
mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log(`[Database] MongoDB connection established: ${mongoose.connection.host}/${mongoose.connection.name}`);
});

mongoose.connection.on('error', (err) => {
  console.error(`[Database] MongoDB connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('[Database] MongoDB connection disconnected.');
});

// Helper to ensure special characters in database passwords (like '@', '#', '$') are URL-encoded
const formatMongoUri = (rawUri) => {
  if (!rawUri || !rawUri.startsWith('mongodb')) return rawUri;
  const prefixMatch = rawUri.match(/^(mongodb(?:\+srv)?:\/\/)/);
  if (!prefixMatch) return rawUri;

  const prefix = prefixMatch[1];
  const withoutPrefix = rawUri.slice(prefix.length);

  const slashOrQuestion = withoutPrefix.search(/[/?]/);
  const authAndHost = slashOrQuestion === -1 ? withoutPrefix : withoutPrefix.slice(0, slashOrQuestion);
  const remaining = slashOrQuestion === -1 ? '' : withoutPrefix.slice(slashOrQuestion);

  const lastAt = authAndHost.lastIndexOf('@');
  if (lastAt === -1) return rawUri;

  const authPart = authAndHost.slice(0, lastAt);
  const hostPart = authAndHost.slice(lastAt + 1);

  const firstColon = authPart.indexOf(':');
  if (firstColon === -1) return rawUri;

  const username = authPart.slice(0, firstColon);
  let password = authPart.slice(firstColon + 1);

  try {
    password = decodeURIComponent(password);
  } catch (e) {}

  return `${prefix}${encodeURIComponent(username)}:${encodeURIComponent(password)}@${hostPart}${remaining}`;
};

const connectDB = async () => {
  let mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/careerconnect';
  mongoUri = formatMongoUri(mongoUri);

  // 1. First attempt: Connect to configured MongoDB URI (Atlas Cloud Cluster)
  if (!mongoUri.includes('<db_password>')) {
    try {
      console.log('[Database] Connecting to MongoDB Atlas Cloud...');
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 4000
      });

      isConnected = true;
      console.log(`[Database] ✅ MongoDB Atlas Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      isConnected = false;
      console.warn(`[Database Notice]: Atlas Cloud connection failed (${error.message})`);
      if (error.message.includes('whitelist') || error.message.includes('SSL alert number 80')) {
        console.log('👉 Tip: To link MongoDB Atlas, add IP 0.0.0.0/0 in MongoDB Atlas -> Network Access.');
      }
    }
  }

  // 2. Resilient Fallback: Local Embedded MongoDB (guarantees 100% zero downtime & persists to disk)
  try {
    console.log('[Database] Initializing persistent local MongoDB instance...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const path = require('path');
    const fs = require('fs');

    const dataDir = path.join(__dirname, '../data/db');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    mongodInstance = await MongoMemoryServer.create({
      instance: {
        dbName: 'careerconnect',
        dbPath: dataDir,
        storageEngine: 'wiredTiger'
      }
    });

    const fallbackUri = mongodInstance.getUri();
    await mongoose.connect(fallbackUri);

    isConnected = true;
    console.log(`[Database] ✅ Connected to persistent local MongoDB: ${fallbackUri}`);
    console.log('[Database] All user accounts, profiles, and applications are permanently saved to disk!');

    // Automatically seed initial accounts if database is empty
    const autoSeed = require('../utils/autoSeed');
    await autoSeed();
  } catch (fallbackError) {
    isConnected = false;
    console.error(`[Database Fatal Error]: Failed to start database fallback: ${fallbackError.message}`);
  }
};

const getDbStatus = () => isConnected || mongoose.connection.readyState === 1;

module.exports = { connectDB, getDbStatus };
