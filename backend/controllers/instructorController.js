const Course = require('../models/Course');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get courses created by the authenticated instructor
// @route   GET /api/instructor/courses
// @access  Private (instructor only)
const getInstructorCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id })
    .populate('instructor', 'name email profileImage')
    .populate('lessons');

  res.json(courses);
});

// @desc    Get stats for the authenticated instructor
// @route   GET /api/instructor/stats
// @access  Private (instructor only)
const getInstructorStats = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id });

  const totalCourses = courses.length;
  let totalStudents = 0;
  let totalEarnings = 0;
  let ratingsSum = 0;
  let ratingsCount = 0;

  courses.forEach((course) => {
    const studentsCount = course.studentsEnrolled?.length || 0;
    totalStudents += studentsCount;
    totalEarnings += (course.price || 0) * studentsCount;

    if (course.ratings && typeof course.ratings.average === 'number') {
      ratingsSum += course.ratings.average;
      ratingsCount += 1;
    }
  });

  const averageRating = ratingsCount > 0 ? Number((ratingsSum / ratingsCount).toFixed(2)) : 0;

  res.json({
    totalCourses,
    totalStudents,
    totalEarnings,
    averageRating
  });
});

module.exports = {
  getInstructorCourses,
  getInstructorStats
};
