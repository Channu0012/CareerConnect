// MongoDB Atlas Connection Verification Script
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { MongoClient, ServerApiVersion } = require('mongodb');

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

let uri = process.argv[2] || process.env.MONGODB_URI || "mongodb+srv://Channu_patil123:Channu%400012@cluster0.nxkcen6.mongodb.net/?appName=Cluster0";
uri = formatMongoUri(uri);
console.log('--------------------------------------------------');
console.log('Testing MongoDB Atlas Connection...');
const maskedUri = uri.replace(/:([^@/:]+)@/, ':****@');
console.log(`Target: ${maskedUri}`);
console.log('--------------------------------------------------');

if (uri.includes('<db_password>')) {
  console.error('\n⚠️  ACTION REQUIRED:');
  console.error('Please replace <db_password> in server/.env with your actual database user password.');
  console.error('Example in server/.env:');
  console.error('MONGODB_URI=mongodb+srv://channupatil299_db_user:YOUR_ACTUAL_PASSWORD@cluster0.nxkcen6.mongodb.net/careerconnect?retryWrites=true&w=majority&appName=Cluster0\n');
  process.exit(1);
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  serverSelectionTimeoutMS: 6000
});

async function run() {
  try {
    // Connect the client to the server
    console.log('Connecting to cluster...');
    await client.connect();

    // Send a ping to confirm a successful connection
    const pingResult = await client.db("admin").command({ ping: 1 });
    console.log('\n✅ Pinged your deployment. You successfully connected to MongoDB!');
    console.log('Ping response:', pingResult);

    // Check cluster databases
    const dbs = await client.db().admin().listDatabases();
    console.log('Available databases on cluster:', dbs.databases.map(d => d.name).join(', ') || 'None yet');
    console.log('--------------------------------------------------');
    console.log('Status: ALL SYSTEMS GO. Your MongoDB Atlas is ready for CareerConnect!\n');
  } catch (error) {
    console.error('\n❌ Connection Failed:');
    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('Reason: Authentication Failed. The password provided for channupatil299_db_user is incorrect.');
      console.error('Tip: Check or reset your database user password in MongoDB Atlas -> Database Access.');
    } else if (error.message.includes('whitelist') || error.message.includes('SSL alert number 80')) {
      console.error('Reason: IP Access List restriction.');
      console.error('Tip: Go to MongoDB Atlas -> Network Access -> Add IP Address -> Select "Allow Access from Anywhere" (0.0.0.0/0).');
    } else {
      console.error(`Error details: ${error.message}`);
    }
    console.error('--------------------------------------------------\n');
    process.exit(1);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run();
