// Security Middleware: Rate Limiter to prevent brute force authentication attacks
const loginAttempts = new Map();

const rateLimiter = (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15-minute sliding window
  const maxAttempts = 60; // Max 60 attempts per 15 mins for login/register

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
