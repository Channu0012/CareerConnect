// Database Seeder Script: Populates realistic test data for internship evaluation & live testing
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const autoSeed = require('./autoSeed');

dotenv.config();

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
  try { password = decodeURIComponent(password); } catch (e) {}
  return `${prefix}${encodeURIComponent(username)}:${encodeURIComponent(password)}@${hostPart}${remaining}`;
};

const runSeeder = async () => {
  try {
    console.log('Connecting to database for seeding...');
    const mongoUri = formatMongoUri(process.env.MONGODB_URI || 'mongodb://localhost:27017/careerconnect');
    
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      console.log('MongoDB connected successfully to primary database.');
    } catch (primaryErr) {
      console.warn('Primary cloud connection failed. Using local embedded memory server fallback...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({ instance: { dbName: 'careerconnect' } });
      await mongoose.connect(mongod.getUri());
      console.log('Connected to embedded memory server for seeding.');
    }

    await autoSeed(true);

    console.log('=============================================');
    console.log('CareerConnect Database Seeded Successfully!');
    console.log('---------------------------------------------');
    console.log('Test Accounts (Password for all: password123)');
    console.log('1. Admin:     admin@careerconnect.com');
    console.log('2. Recruiter: recruiter@techflow.com');
    console.log('3. Candidate: candidate@careerconnect.com (Has live applications & interview)');
    console.log('4. Candidate: priya@careerconnect.com (Has offer extended & under review)');
    console.log('=============================================');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

runSeeder();
