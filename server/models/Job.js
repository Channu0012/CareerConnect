// Job Model: Stores job postings published by recruiters
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a job description']
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Job must belong to a company']
    },
    location: {
      type: String,
      required: [true, 'Please provide job location'],
      trim: true
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
      default: 'Full-time'
    },
    experienceLevel: {
      type: String,
      enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead / Principal'],
      default: 'Entry Level'
    },
    salaryRange: {
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'INR'
      }
    },
    skills: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['Active', 'Closed', 'Draft'],
      default: 'Active'
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Job must be linked to a recruiter']
    },
    applicationsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Index for search optimization (search by title, description, skills)
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
