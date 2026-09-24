// Admin Controller: Platform oversight, user management, and global statistics
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');
const Candidate = require('../models/Candidate');
const { escapeRegex } = require('../utils/sanitize');

// @desc    Get global platform metrics & statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCandidates = await User.countDocuments({ role: 'candidate' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'Active' });
    const closedJobs = await Job.countDocuments({ status: 'Closed' });

    const totalApplications = await Application.countDocuments();
    const totalCompanies = await Company.countDocuments();

    // Group applications by status
    const applicationsByStatus = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      users: {
        total: totalUsers,
        candidates: totalCandidates,
        recruiters: totalRecruiters,
        admins: totalAdmins
      },
      jobs: {
        total: totalJobs,
        active: activeJobs,
        closed: closedJobs
      },
      applications: {
        total: totalApplications,
        breakdown: applicationsByStatus
      },
      companies: {
        total: totalCompanies
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (with search and role filter)
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const query = {};

    if (req.query.role && req.query.role !== 'all') {
      query.role = req.query.role;
    }

    if (req.query.search) {
      const sanitized = escapeRegex(req.query.search);
      if (sanitized) {
        const searchRegex = new RegExp(sanitized, 'i');
        query.$or = [{ name: searchRegex }, { email: searchRegex }];
      }
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (Active / Inactive)
// @route   PATCH /api/admin/users/:id/status
// @access  Private (Admin only)
const updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Guard: Prevent admin from deactivating their own account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot deactivate your own admin account' });
    }

    const { status } = req.body;
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Status must be active or inactive' });
    }

    user.status = status;
    await user.save();

    res.json({
      message: `User marked as ${status}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user and their related profiles
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Guard: Prevent admin from deleting their own account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }

    // Cascade cleanups
    if (user.role === 'candidate') {
      await Candidate.deleteOne({ user: user._id });
      await Application.deleteMany({ candidate: user._id });
    } else if (user.role === 'recruiter') {
      const recruiterJobs = await Job.find({ recruiter: user._id });
      const jobIds = recruiterJobs.map((j) => j._id);
      await Application.deleteMany({ job: { $in: jobIds } });
      await Job.deleteMany({ recruiter: user._id });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User and associated data removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs across the platform (Admin view)
// @route   GET /api/admin/jobs
// @access  Private (Admin only)
const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find()
      .populate('company', 'name logo location')
      .populate('recruiter', 'name email')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlatformStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllJobs
};
