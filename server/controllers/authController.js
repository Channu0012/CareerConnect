// Authentication Controller: Handles registration, login, and current user profile with NoSQL injection prevention
const User = require('../models/User');
const Candidate = require('../models/Candidate');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user (Candidate or Recruiter)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    let { name, email, password, role } = req.body;

    // Security: Validate inputs are primitive strings (prevents NoSQL object injections)
    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid request format: Name, email, and password must be text strings' });
    }

    name = name.trim();
    email = email.trim().toLowerCase();

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Email format validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Password length validation
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email address already exists' });
    }

    // Disallow registering directly as admin from the public registration form
    const assignedRole = role === 'recruiter' ? 'recruiter' : 'candidate';

    // Create the user record (password is automatically hashed by Mongoose pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole
    });

    // If the registered user is a candidate, initialize their candidate profile
    if (user.role === 'candidate') {
      await Candidate.create({
        user: user._id,
        name: user.name,
        email: user.email
      });
    }

    // Return user info and JWT token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    // Security: Validate inputs are primitive strings (prevents NoSQL injection such as { email: { $gt: "" } })
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid credentials format' });
    }

    email = email.trim().toLowerCase();

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    // Find user by normalized email
    const user = await User.findOne({ email });

    // Check password match using bcrypt
    if (user && (await user.matchPassword(password))) {
      // Check if user account is deactivated
      if (user.status === 'inactive') {
        return res.status(403).json({ message: 'Your account is deactivated. Please contact support.' });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        token: generateToken(user._id)
      });
    } else {
      // Generic error response to prevent user enumeration attacks
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile (name, email, password)
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.name && typeof req.body.name === 'string') {
      user.name = req.body.name.trim();
    }

    if (req.body.email && typeof req.body.email === 'string') {
      user.email = req.body.email.trim().toLowerCase();
    }

    if (req.body.password && typeof req.body.password === 'string') {
      if (req.body.password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      token: generateToken(updatedUser._id)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile
};
