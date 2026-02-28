const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Report title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['gig', 'user', 'review'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'investigating', 'resolved', 'dismissed'],
      default: 'pending',
    },
    reason:         { type: String, default: '' },
    details:        { type: String, default: '' },
    reporter:       { type: String, default: 'Anonymous' },
    reporterCampus: { type: String, default: '—' },
    target:         { type: String, default: '' },
    targetCampus:   { type: String, default: '—' },
    adminNotes:     { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
