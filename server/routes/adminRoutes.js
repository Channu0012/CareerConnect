// Administrator Oversight Routes
const express = require('express');
const router = express.Router();
const {
  getPlatformStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllJobs
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require authentication and 'admin' role
router.use(protect, authorize('admin'));

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/jobs', getAllJobs);

module.exports = router;
