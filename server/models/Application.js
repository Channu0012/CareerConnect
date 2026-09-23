// Application Model: Connects a candidate to a job posting
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Application must belong to a candidate']
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Application must be for a specific job']
    },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Rejected', 'Selected'],
      default: 'Applied'
    },
    coverLetter: {
      type: String,
      default: ''
    },
    resumeLink: {
      type: String,
      default: ''
    },
    recruiterNotes: {
      type: String,
      default: ''
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Prevent a candidate from applying to the same job multiple times
applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
