// Security Middleware: Rate Limiter to prevent brute force authentication attacks
const loginAttempts = new Map();

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15-minute sliding window
  const maxAttempts = 10; // Max 10 attempts per 15 mins

  if (!loginAttempts.has(ip)) {
    loginAttempts.set(ip, []);
  }

  // Filter out timestamps outside current sliding window
  const timestamps = loginAttempts.get(ip).filter((time) => now - time < windowMs);
  timestamps.push(now);
  loginAttempts.set(ip, timestamps);

  if (timestamps.length > maxAttempts) {
    return res.status(429).json({
      message: 'Too many authentication attempts from this IP address. Please try again after 15 minutes.'
    });
  }

  next();
};

module.exports = { rateLimiter };
