// Server Entry Point
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const app = require('./app');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
});
