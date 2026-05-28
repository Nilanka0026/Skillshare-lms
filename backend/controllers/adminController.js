const User = require('../models/User');
const Course = require('../models/Course');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin only)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// @desc    Get all courses
// @route   GET /api/admin/courses
// @access  Private (admin only)
const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find()
    .populate('instructor', 'name email profileImage')
    .populate('lessons');

  res.json(courses);
});

module.exports = {
  getAllUsers,
  getAllCourses
};
