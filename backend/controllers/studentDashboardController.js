const Enrollment = require('../models/Enrollment');
const asyncHandler = require('../utils/asyncHandler');
const { sanitizeCourseQuizzes } = require('./quizController');

// @desc    Get student enrolled courses with progress
// @route   GET /api/student/my-courses
// @access  Private (student only)
const getStudentCourses = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({
      path: 'course',
      populate: [
        { path: 'instructor', select: 'name email profileImage bio' },
        { path: 'lessons' }
      ]
    });

  const coursesWithProgress = enrollments
    .filter(enrollment => enrollment.course)
    .map(enrollment => {
      const courseObj = sanitizeCourseQuizzes(enrollment.course);
      return {
        ...courseObj,
        progress: enrollment.progress || 0,
        isCompleted: enrollment.isCompleted || false,
        completedAt: enrollment.completedAt || null,
        enrolledAt: enrollment.enrolledAt || enrollment.createdAt,
        completedLessons: enrollment.completedLessons || [],
        quizResults: enrollment.quizResults || []
      };
    });

  res.json(coursesWithProgress);
});

// @desc    Get student profile details
// @route   GET /api/student/profile
// @access  Private (student only)
const getStudentProfile = asyncHandler(async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    profileImage: req.user.profileImage,
    enrolledCoursesCount: req.user.enrolledCourses?.length || 0
  });
});

module.exports = {
  getStudentCourses,
  getStudentProfile
};
