// Candidate Profile Routes
const express = require('express');
const router = express.Router();
const {
  getMyCandidateProfile,
  updateMyCandidateProfile,
  getCandidateById
} = require('../controllers/candidateController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/me', protect, authorize('candidate'), getMyCandidateProfile);
router.put('/me', protect, authorize('candidate'), updateMyCandidateProfile);
router.get('/:userId', protect, authorize('recruiter', 'admin'), getCandidateById);

module.exports = router;
