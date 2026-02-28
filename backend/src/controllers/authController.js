const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// ── Helper: generate JWT ───────────────────────────────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// ── @route   POST /api/auth/login
// ── @desc    Login user & return token
// ── @access  Public
const loginUser = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // 1. Find user by email (include password field for comparison)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 2. Check account status
    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.',
      });
    }

    if (user.status === 'pending' || !user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending admin verification. You will be notified once approved.',
      });
    }

    // 3. Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 4. Generate token
    const token = generateToken(user._id);

    // 5. Return safe user object + token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

// ── @route   POST /api/auth/register
// ── @desc    Register new user & return token
// ── @access  Public
const registerUser = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const { fullName, email, password, campus, role, studentMode } = req.body;

    // 1. Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // 2. Build user object
    const isCampus = role === 'campus';
    const isStudent = role === 'student';

    const userData = {
      name: fullName.trim(),
      email: email.toLowerCase().trim(),
      password,
      type: isCampus ? 'campus' : 'student',
      campus: campus ? campus.trim() : '',
      status: 'pending',
      isVerified: false,
    };

    if (isStudent) {
      const mode = studentMode || 'freelancer';
      userData.registeredModes = mode;
      userData.activeMode = mode === 'recruiter' ? 'recruiter' : 'freelancer';
    }

    // 3. Create user (pre-save hook hashes password)
    await User.create(userData);

    // 4. Return success — no token until admin verifies
    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please wait for admin verification before logging in.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginUser,
  registerUser,
};
