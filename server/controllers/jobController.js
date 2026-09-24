// Job Controller: Handles CRUD operations, search, filters, pagination, and recruiter ownership checks
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const { escapeRegex } = require('../utils/sanitize');

// @desc    Get all jobs with search, filters, and pagination
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    // Build filter query object
    const query = {};

    // Filter by Active status for public view, unless specified
    if (req.query.status) {
      query.status = req.query.status;
    } else {
      query.status = 'Active';
    }

    // Keyword search (searches title, description, or skills)
    if (req.query.search) {
      const sanitizedSearch = escapeRegex(req.query.search);
      if (sanitizedSearch) {
        const searchRegex = new RegExp(sanitizedSearch, 'i');
        query.$or = [
          { title: searchRegex },
          { description: searchRegex },
          { skills: { $in: [searchRegex] } }
        ];
      }
    }

    // Filter by location
    if (req.query.location) {
      const sanitizedLocation = escapeRegex(req.query.location);
      if (sanitizedLocation) {
        query.location = new RegExp(sanitizedLocation, 'i');
      }
    }

    // Filter by employment type
    if (req.query.employmentType && req.query.employmentType !== 'All') {
      query.employmentType = req.query.employmentType;
    }

    // Filter by experience level
    if (req.query.experienceLevel && req.query.experienceLevel !== 'All') {
      query.experienceLevel = req.query.experienceLevel;
    }

    // Filter by company
    if (req.query.company) {
      query.company = req.query.company;
    }

    // Execute query with pagination and population
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('company', 'name logo location industry website')
      .populate('recruiter', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      jobs,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name description logo location industry website')
      .populate('recruiter', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Recruiter & Admin)
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      company,
      location,
      employmentType,
      experienceLevel,
      salaryRange,
      skills,
      status
    } = req.body;

    // Validate required fields
    if (!title || !description || !company || !location) {
      return res.status(400).json({ message: 'Please provide title, description, company, and location' });
    }

    // Verify company exists in database
    const companyExists = await Company.findById(company);
    if (!companyExists) {
      return res.status(404).json({ message: 'Selected company does not exist' });
    }

    // Process skills if passed as comma-separated string or array
    let skillsArray = [];
    if (Array.isArray(skills)) {
      skillsArray = skills;
    } else if (typeof skills === 'string') {
      skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const job = await Job.create({
      title,
      description,
      company,
      location,
      employmentType: employmentType || 'Full-time',
      experienceLevel: experienceLevel || 'Entry Level',
      salaryRange: salaryRange || { min: 0, max: 0, currency: 'INR' },
      skills: skillsArray,
      status: status || 'Active',
      recruiter: req.user._id
    });

    const populatedJob = await Job.findById(job._id)
      .populate('company', 'name logo location industry')
      .populate('recruiter', 'name email');

    res.status(201).json(populatedJob);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job posting (with ownership check)
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter who owns the job, or Admin)
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Security Ownership Check: Ensure user is the owner recruiter or an admin
    if (
      job.recruiter.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'Security Alert: You are not authorized to update this job listing (Ownership violation)'
      });
    }

    // Process skills if updated
    if (req.body.skills && typeof req.body.skills === 'string') {
      req.body.skills = req.body.skills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    // Security Guard: Prevent caller from hijacking job ownership or manipulating counter
    delete req.body.recruiter;
    delete req.body.applicationsCount;

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('company', 'name logo location industry')
      .populate('recruiter', 'name email');

    res.json(updatedJob);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job posting (with ownership check)
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter who owns the job, or Admin)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Security Ownership Check: Ensure user is the owner recruiter or an admin
    if (
      job.recruiter.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'Security Alert: You are not authorized to delete this job listing (Ownership violation)'
      });
    }

    // Delete associated applications
    await Application.deleteMany({ job: job._id });

    // Delete job
    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: 'Job and associated applications deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs managed by the current logged-in recruiter
// @route   GET /api/jobs/recruiter/my-jobs
// @access  Private (Recruiter)
const getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id })
      .populate('company', 'name logo location')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs
};
