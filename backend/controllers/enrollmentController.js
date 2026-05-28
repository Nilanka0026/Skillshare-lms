const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Enroll in a course
// @route   POST /api/enroll/:courseId
// @access  Private (student only)
const enrollInCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Check if student is already enrolled
  const existingEnrollment = await Enrollment.findOne({
    student: req.user._id,
    course: courseId
  });

  if (existingEnrollment) {
    res.status(400);
    throw new Error('You are already enrolled in this course');
  }

  // Create enrollment record
  const enrollment = await Enrollment.create({
    student: req.user._id,
    course: courseId,
    progress: 0,
    completedLessons: []
  });

  // Update Course studentsEnrolled
  await Course.findByIdAndUpdate(courseId, {
    $addToSet: { studentsEnrolled: req.user._id }
  });

  // Update User enrolledCourses
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { enrolledCourses: courseId }
  });

  res.status(201).json({
    message: 'Enrolled successfully',
    enrollment
  });
});

module.exports = { enrollInCourse };
