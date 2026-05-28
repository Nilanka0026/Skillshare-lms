const express = require('express');
const { getAllCourses, getAllUsers } = require('../controllers/adminController');
const { authorizeRoles, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/users', protect, authorizeRoles('admin'), getAllUsers);
router.get('/courses', protect, authorizeRoles('admin'), getAllCourses);

module.exports = router;
