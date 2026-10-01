const express = require('express');
const { enrollInCourse, unenrollFromCourse } = require('../controllers/enrollmentController');
const { authorizeRoles, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/:courseId')
  .get(protect, authorizeRoles('student'), require('../controllers/enrollmentController').checkEnrollmentStatus)
  .post(protect, authorizeRoles('student'), enrollInCourse)
  .delete(protect, authorizeRoles('student'), unenrollFromCourse);
router.route('/:courseId/lessons/:lessonId/complete')
  .post(protect, authorizeRoles('student'), require('../controllers/enrollmentController').completeLesson);

module.exports = router;
