// Application Routes: Handles candidate applications and recruiter application reviews
const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Candidate routes
router.post('/:jobId', protect, authorize('candidate'), applyForJob);
router.get('/my-applications', protect, authorize('candidate'), getMyApplications);

// Recruiter routes
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplications);
router.patch('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;
