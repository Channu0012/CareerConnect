// Application Controller: Handles candidate job applications and recruiter review workflows
const Application = require('../models/Application');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Candidate only)
const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverLetter, resumeLink } = req.body;

    // Check if candidate profile exists
    const candidateProfile = await Candidate.findOne({ user: req.user._id });

    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    if (job.status !== 'Active') {
      return res.status(400).json({ message: 'This job posting is no longer active for applications' });
    }

    // Check for duplicate application
    const existingApplication = await Application.findOne({
      candidate: req.user._id,
      job: jobId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this position' });
    }

    // Create new application
    const application = await Application.create({
      candidate: req.user._id,
      job: jobId,
      coverLetter: coverLetter || '',
      resumeLink: resumeLink || (candidateProfile ? candidateProfile.resumeLink : '')
    });

    // Increment applications count on the job
    job.applicationsCount += 1;
    await job.save();

    const populatedApplication = await Application.findById(application._id)
      .populate('job', 'title location employmentType company')
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo' }
      });

    res.status(201).json(populatedApplication);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications submitted by the logged-in candidate
// @route   GET /api/applications/my-applications
// @access  Private (Candidate only)
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate({
        path: 'job',
        populate: {
          path: 'company',
          select: 'name logo location'
        }
      })
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for a specific job (Recruiter view)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter who owns the job, or Admin)
const getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Recruiter Ownership Check
    if (
      job.recruiter.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'Security Alert: You are not authorized to view applications for this job listing'
      });
    }

    // Find applications and populate candidate user info
    const applications = await Application.find({ job: jobId })
      .populate('candidate', 'name email createdAt')
      .sort({ appliedAt: -1 });

    // Fetch matching candidate profile details (skills, experience, headline)
    const detailedApplications = await Promise.all(
      applications.map(async (app) => {
        const profile = app.candidate ? await Candidate.findOne({ user: app.candidate._id }) : null;
        return {
          ...app.toObject(),
          candidateProfile: profile || null
        };
      })
    );

    res.json({
      jobTitle: job.title,
      totalApplicants: detailedApplications.length,
      applications: detailedApplications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status & recruiter notes
// @route   PATCH /api/applications/:id/status
// @access  Private (Recruiter who owns the job, or Admin)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, recruiterNotes } = req.body;

    const application = await Application.findById(id).populate('job');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (!application.job) {
      return res.status(404).json({ message: 'Associated job posting no longer exists' });
    }

    // Security Ownership Check: Ensure the recruiter owns the job associated with this application
    if (
      application.job.recruiter &&
      application.job.recruiter.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'Security Alert: You do not have permission to manage this application'
      });
    }

    // Validate status if provided
    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Rejected', 'Selected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values are: ${validStatuses.join(', ')}`
      });
    }

    if (status) application.status = status;
    if (recruiterNotes !== undefined) application.recruiterNotes = recruiterNotes;

    await application.save();

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
};
