const mongoose = require('mongoose');

const actionLogSchema = new mongoose.Schema(
  {
    admin:  { type: String, required: true },
    action: { type: String, required: true },
    type: {
      type: String,
      enum: ['ban', 'delete', 'warning', 'resolve', 'restore', 'verify', 'flag', 'config'],
      default: 'config',
    },
    target: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActionLog', actionLogSchema);
