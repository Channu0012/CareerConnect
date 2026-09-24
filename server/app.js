// Express App Configuration & Security Hardening
const express = require('express');
const cors = require('cors');
const { getDbStatus } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const companyRoutes = require('./routes/companyRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Security: Enforce CORS policy
const corsOptions = {
  origin: process.env.CLIENT_URL || ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Security: HTTP Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Security: Strict payload size limiter to prevent Denial of Service (DoS) memory floods
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Health Check API (doesn't require DB connection)
app.get('/api/health', (req, res) => {
  const dbConnected = getDbStatus();
  res.json({
    status: 'OK',
    database: dbConnected ? 'Connected' : 'Disconnected (Offline)',
    message: dbConnected
      ? 'CareerConnect Backend API and Database are active and healthy'
      : 'API is running, but MongoDB connection is currently offline. Please configure MONGODB_URI in server/.env with your MongoDB Atlas connection string.',
    timestamp: new Date().toISOString()
  });
});

// Database Readiness Guard: Catches disconnected state immediately instead of waiting for 10-second timeout
app.use('/api', (req, res, next) => {
  // Allow health check to pass through
  if (req.path === '/health') return next();

  if (!getDbStatus()) {
    return res.status(503).json({
      message: 'Database connection is currently offline. Please ensure MongoDB is started locally or add your MongoDB Atlas cluster URI into server/.env (MONGODB_URI=mongodb+srv://...).'
    });
  }
  next();
});

// Security: Rate limiting applied to authentication endpoints
app.use('/api/auth', authRoutes);

// API Routes Mounting
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
