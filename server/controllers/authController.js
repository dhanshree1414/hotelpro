const User = require('../models/User');
const jwt = require('jsonwebtoken');
const store = require('../data/store');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'hotelpro_super_secret_jwt_key_2026', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (global.isMongoConnected) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const user = await User.create({
        name,
        email,
        password,
        phone: phone || '',
        role: role === 'admin' ? 'admin' : 'guest'
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      const userExists = store.findUserByEmail(email);
      if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const user = await store.createUser({
        name,
        email,
        password,
        phone,
        role
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (global.isMongoConnected) {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token: generateToken(user._id)
        });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    } else {
      const user = store.findUserByEmail(email);
      if (user && (await store.comparePassword(password, user.password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token: generateToken(user._id)
        });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    if (global.isMongoConnected) {
      const user = await User.findById(req.user._id).select('-password');
      if (user) {
        return res.json(user);
      }
      return res.status(404).json({ message: 'User not found' });
    } else {
      const user = store.findUserById(req.user._id);
      if (user) {
        return res.json(user);
      }
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
