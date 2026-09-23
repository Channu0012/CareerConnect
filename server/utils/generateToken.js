// Helper function to generate signed JWT token for authentication
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'careerconnect_secret_key', {
    expiresIn: '30d' // Token valid for 30 days
  });
};

module.exports = generateToken;
