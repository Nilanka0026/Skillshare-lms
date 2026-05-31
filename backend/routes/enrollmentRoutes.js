const express = require('express');
const { enrollInCourse, unenrollFromCourse } = require('../controllers/enrollmentController');
const { authorizeRoles, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/:courseId')
  .post(protect, authorizeRoles('student'), enrollInCourse)
  .delete(protect, authorizeRoles('student'), unenrollFromCourse);

module.exports = router;
