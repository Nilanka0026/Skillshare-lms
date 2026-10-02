const express = require('express');
const { getStudentCourses, getStudentProfile } = require('../controllers/studentDashboardController');
const { getStudentQuizAttempts } = require('../controllers/quizController');
const { authorizeRoles, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('student', 'admin'));

router.get('/my-courses', getStudentCourses);
router.get('/profile', getStudentProfile);
router.get('/quiz-attempts', authorizeRoles('student'), getStudentQuizAttempts);

module.exports = router;
