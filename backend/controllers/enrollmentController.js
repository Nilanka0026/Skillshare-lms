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
    completedLessons: [],
    enrolledAt: new Date()
  });

  // Update Course studentsEnrolled, enrolledStudents, and enrollmentCount
  await Course.findByIdAndUpdate(courseId, {
    $addToSet: {
      studentsEnrolled: req.user._id,
      enrolledStudents: req.user._id
    },
    $inc: { enrollmentCount: 1 }
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

// @desc    Unenroll from a course
// @route   DELETE /api/enroll/:courseId
// @access  Private (student only)
const unenrollFromCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Check if enrollment exists
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: courseId
  });

  if (!enrollment) {
    res.status(400);
    throw new Error('You are not enrolled in this course');
  }

  // Delete enrollment record
  await enrollment.deleteOne();

  // Update Course: remove user and decrement enrollmentCount
  await Course.findByIdAndUpdate(courseId, {
    $pull: {
      studentsEnrolled: req.user._id,
      enrolledStudents: req.user._id
    },
    $inc: { enrollmentCount: -1 }
  });

  // Ensure enrollmentCount doesn't go below 0
  const updatedCourse = await Course.findById(courseId);
  if (updatedCourse && updatedCourse.enrollmentCount < 0) {
    updatedCourse.enrollmentCount = 0;
    await updatedCourse.save();
  }

  // Update User: remove course
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { enrolledCourses: courseId }
  });

  res.json({
    message: 'Unenrolled successfully'
  });
});

module.exports = { enrollInCourse, unenrollFromCourse };
