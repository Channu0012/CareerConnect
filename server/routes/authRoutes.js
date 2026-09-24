// Authentication Routes
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const { validateRegisterInput, validateLoginInput } = require('../validators/authValidator');
const { rateLimiter } = require('../middleware/rateLimitMiddleware');

router.post('/register', rateLimiter, validateRegisterInput, registerUser);
router.post('/login', rateLimiter, validateLoginInput, loginUser);
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
