const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never return password in queries by default
    },

    // Role: admin | campus | student
    type: {
      type: String,
      enum: ['admin', 'campus', 'student'],
      required: [true, 'User type is required'],
      default: 'student',
    },

    // Student mode: freelancer | recruiter | both
    registeredModes: {
      type: String,
      enum: ['freelancer', 'recruiter', 'both'],
      default: 'freelancer',
    },

    activeMode: {
      type: String,
      enum: ['freelancer', 'recruiter'],
      default: 'freelancer',
    },

    // Campus reference (for campus admins and students)
    campus: {
      type: String,
      default: '',
    },

    // Account status
    status: {
      type: String,
      enum: ['active', 'suspended', 'pending', 'rejected'],
      default: 'active',
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // Profile extras
    avatar: {
      type: String,
      default: null,
    },

    phone: {
      type: String,
      default: '',
    },

    location: {
      type: String,
      default: '',
    },

    bio: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// ── Hash password before saving ────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Compare entered password with hashed password ──────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ── Return safe user object (no password) ─────────────
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    type: this.type,
    registeredModes: this.registeredModes,
    activeMode: this.activeMode,
    campus: this.campus,
    status: this.status,
    isVerified: this.isVerified,
    avatar: this.avatar,
    phone: this.phone,
    location: this.location,
    bio: this.bio,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
