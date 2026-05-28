const express = require('express');
const { enrollInCourse } = require('../controllers/enrollmentController');
const { authorizeRoles, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:courseId', protect, authorizeRoles('student'), enrollInCourse);

module.exports = router;
