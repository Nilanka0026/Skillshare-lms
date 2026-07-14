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

// @desc    Verify instructor status
// @route   PUT /api/admin/users/:id/verify
// @access  Private (admin only)
const verifyInstructor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Invalid verification status. Must be approved or rejected.');
  }

  const user = await User.findById(id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role !== 'instructor') {
    res.status(400);
    throw new Error('User is not an instructor');
  }

  user.verificationStatus = status;
  await user.save();

  res.json({
    message: `Instructor status updated to ${status}`,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus
    }
  });
});

module.exports = {
  getAllUsers,
  getAllCourses,
  verifyInstructor
};
