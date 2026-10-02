const express = require('express');
const { getAllCourses, getAllUsers, verifyInstructor } = require('../controllers/adminController');
const { listAdminQuizzes } = require('../controllers/quizController');
const { authorizeRoles, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/users', protect, authorizeRoles('admin'), getAllUsers);
router.get('/courses', protect, authorizeRoles('admin'), getAllCourses);
router.get('/quizzes', protect, authorizeRoles('admin'), listAdminQuizzes);
router.put('/users/:id/verify', protect, authorizeRoles('admin'), verifyInstructor);

module.exports = router;
