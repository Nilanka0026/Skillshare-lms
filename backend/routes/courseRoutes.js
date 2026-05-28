const express = require('express');
const {
  addLesson,
  addReview,
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  getMyCourses,
  updateCourse
} = require('../controllers/courseController');
const { authorizeRoles, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getCourses)
  .post(protect, authorizeRoles('instructor', 'admin'), createCourse);

router.get('/my-courses', protect, authorizeRoles('student'), getMyCourses);

router.route('/:id')
  .get(getCourseById)
  .put(protect, authorizeRoles('instructor', 'admin'), updateCourse)
  .delete(protect, authorizeRoles('instructor', 'admin'), deleteCourse);

router.post('/:id/lessons', protect, authorizeRoles('instructor', 'admin'), addLesson);
router.post('/:id/reviews', protect, authorizeRoles('student'), addReview);

module.exports = router;
