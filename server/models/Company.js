// Company Model: Stores companies registered by Recruiters or Admins
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide company name'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide company description']
    },
    website: {
      type: String,
      default: ''
    },
    industry: {
      type: String,
      required: [true, 'Please provide company industry'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Please provide company location'],
      trim: true
    },
    logo: {
      type: String,
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
