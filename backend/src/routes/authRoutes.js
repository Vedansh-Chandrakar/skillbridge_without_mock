const express = require('express');
const { body } = require('express-validator');
const { loginUser, registerUser } = require('../controllers/authController');

const router = express.Router();

// ── Login validation rules ─────────────────────────────
const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// ── Register validation rules ──────────────────────────
const registerValidation = [
  body('fullName')
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('campus')
    .notEmpty().withMessage('Campus / Institution is required'),

  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['student', 'campus']).withMessage('Invalid role'),

  body('studentMode')
    .optional()
    .isIn(['freelancer', 'recruiter', 'both']).withMessage('Invalid student mode'),
];

// ── Routes ─────────────────────────────────────────────

// POST /api/auth/login
router.post('/login', loginValidation, loginUser);

// POST /api/auth/register
router.post('/register', registerValidation, registerUser);

module.exports = router;
