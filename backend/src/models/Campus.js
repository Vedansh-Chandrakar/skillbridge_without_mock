const mongoose = require('mongoose');

const campusSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Campus name is required'],
      unique: true,
      trim: true,
    },
    domain: {
      type: String,
      required: [true, 'Domain is required'],
      trim: true,
    },
    adminEmail: {
      type: String,
      required: [true, 'Admin email is required'],
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'inactive'],
      default: 'pending',
    },
    // Profile fields
    location:     { type: String, default: '' },
    description:  { type: String, default: '' },
    website:      { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    established:  { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Campus', campusSchema);
