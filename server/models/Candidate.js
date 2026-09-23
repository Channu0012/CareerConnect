// Candidate Model: Stores detailed profile info for job seekers
const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: ''
    },
    headline: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    skills: {
      type: [String],
      default: []
    },
    experience: [
      {
        title: String,
        company: String,
        duration: String,
        description: String
      }
    ],
    education: [
      {
        degree: String,
        institution: String,
        year: String
      }
    ],
    resumeLink: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;
