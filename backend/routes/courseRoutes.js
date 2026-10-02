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
const {
  createQuiz,
  deleteQuiz,
  getQuizAttempt,
  listQuizAttempts,
  startQuizAttempt,
  submitQuizAttempt,
  updateQuiz
} = require('../controllers/quizController');
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
router.post('/:id/quizzes', protect, authorizeRoles('instructor', 'admin'), createQuiz);
router.patch('/:id/quizzes/:quizId', protect, authorizeRoles('instructor', 'admin'), updateQuiz);
router.delete('/:id/quizzes/:quizId', protect, authorizeRoles('instructor', 'admin'), deleteQuiz);
router.post('/:id/reviews', protect, authorizeRoles('student'), addReview);
router.post('/:id/quizzes/:quizId/submit', protect, authorizeRoles('student'), require('../controllers/courseController').submitQuiz);
router.post('/:id/quizzes/:quizId/attempts', protect, authorizeRoles('student'), startQuizAttempt);
router.post('/:id/quizzes/:quizId/attempts/:attemptId/submit', protect, authorizeRoles('student'), submitQuizAttempt);
router.get('/:id/quizzes/:quizId/attempts', protect, authorizeRoles('instructor', 'admin'), listQuizAttempts);
router.get('/:id/quizzes/:quizId/attempts/:attemptId', protect, authorizeRoles('instructor', 'admin'), getQuizAttempt);

module.exports = router;
