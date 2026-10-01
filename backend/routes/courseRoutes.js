const express = require('express');
const {
  addLesson,
  addReview,
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  getMyCourses,
  removeLesson,
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
router.delete('/:id/lessons/:lessonId', protect, authorizeRoles('instructor', 'admin'), removeLesson);
router.post('/:id/quizzes', protect, authorizeRoles('instructor', 'admin'), require('../controllers/courseController').addQuiz);
router.post('/:id/reviews', protect, authorizeRoles('student'), addReview);
router.post('/:id/quizzes/:quizId/submit', protect, authorizeRoles('student'), require('../controllers/courseController').submitQuiz);

module.exports = router;
