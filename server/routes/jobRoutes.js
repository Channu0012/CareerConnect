// Job Routes: Handles job browsing, creation, updating, and deletion
const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route to list all active jobs (with search/filters)
router.get('/', getJobs);

// Recruiter route to get only their own posted jobs
router.get('/recruiter/my-jobs', protect, authorize('recruiter', 'admin'), getRecruiterJobs);

const { validateJobInput } = require('../validators/jobValidator');

// Public route to view single job details
router.get('/:id', getJobById);

// Recruiter/Admin route to create a new job
router.post('/', protect, authorize('recruiter', 'admin'), validateJobInput, createJob);

// Recruiter/Admin route to edit an existing job (includes backend ownership check)
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);

// Recruiter/Admin route to delete a job (includes backend ownership check)
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;
