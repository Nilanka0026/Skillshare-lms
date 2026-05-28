const express = require('express');
const { getInstructorCourses, getInstructorStats } = require('../controllers/instructorController');
const { authorizeRoles, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/courses', protect, authorizeRoles('instructor', 'admin'), getInstructorCourses);
router.get('/stats', protect, authorizeRoles('instructor', 'admin'), getInstructorStats);

module.exports = router;
