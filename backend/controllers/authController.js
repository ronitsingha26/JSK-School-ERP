const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * POST /api/auth/login
 * Authenticate user with email + password + role validation.
 */
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (!role) {
      return res.status(400).json({ message: 'Please select a role.' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check if account is active
    if (!user.is_active) {
      return res.status(403).json({ message: 'Account deactivated. Contact administrator.' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Verify role matches
    if (user.role !== role) {
      return res.status(403).json({
        message: `Access denied. You are not registered as "${role}". Your role is "${user.role}".`,
      });
    }

    // Generate JWT (7 day expiry)
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

/**
 * GET /api/auth/me
 * Get current authenticated user profile.
 */
const getMe = async (req, res) => {
  try {
    res.json({ user: req.user.toJSON() });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { login, getMe };
