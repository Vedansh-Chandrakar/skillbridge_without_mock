const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    campus: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Internship', 'Full-time', 'Contract', 'Part-time'],
      default: 'Internship',
    },
    location: {
      type: String,
      default: '',
    },
    salary: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    requirements: {
      type: [String],
      default: [],
    },
    deadline: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Opportunity', opportunitySchema);
