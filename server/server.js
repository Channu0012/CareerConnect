// Load environment variables first before importing modules that depend on them
require('dotenv').config();

const { connectDB } = require('./config/db');
const app = require('./app');

// Connect to MongoDB Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
});
