// Authentication & Authorization Middleware
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes: Ensures the request contains a valid JWT token
const protect = async (req, res, next) => {
  let token;

  // Check if Bearer token is provided in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify the JWT signature
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'careerconnect_secret_key'
      );

      // Find user by ID and attach to request object (exclude password)
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'User not found or account removed' });
      }

      // Check if user account is deactivated
      if (user.status === 'inactive') {
        return res.status(403).json({ message: 'Your account has been deactivated. Please contact admin.' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Authorize roles: Ensures user has one of the allowed roles (e.g. 'recruiter', 'admin')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: User role '${req.user ? req.user.role : 'anonymous'}' is not authorized to access this resource`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
