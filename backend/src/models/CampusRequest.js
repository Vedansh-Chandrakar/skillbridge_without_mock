const mongoose = require('mongoose');

const campusRequestSchema = new mongoose.Schema(
  {
    campusName:    { type: String, required: true, trim: true },
    domain:        { type: String, default: '', trim: true },
    contactEmail:  { type: String, required: true, lowercase: true, trim: true },
    requestedBy:   { type: String, default: '' },          // requester's name
    message:       { type: String, default: '' },          // optional note
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminNote: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CampusRequest', campusRequestSchema);
