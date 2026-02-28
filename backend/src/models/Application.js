const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coverLetter: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'shortlisted', 'accepted', 'rejected'],
      default: 'pending',
    },
    // Extra fields student fills on apply
    major: { type: String, default: '' },
    year:  { type: String, default: '' },
    gpa:   { type: String, default: '' },
  },
  { timestamps: true }
);

// One student can apply only once per opportunity
applicationSchema.index({ opportunity: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
