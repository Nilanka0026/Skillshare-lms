const User = require('../models/User');
const Course = require('../models/Course');
const Review = require('../models/Review');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all teachers with calculated stats
// @route   GET /api/teachers
// @access  Public
const getTeachers = asyncHandler(async (req, res) => {
  const teachers = await User.find({ role: 'instructor' }).select('-password');
  
  const teachersWithStats = await Promise.all(
    teachers.map(async (teacher) => {
      const courses = await Course.find({ instructor: teacher._id });
      const courseIds = courses.map((c) => c._id);
      
      const courseCount = courses.length;
      let studentCount = 0;

      courses.forEach((course) => {
        studentCount += course.enrolledStudents?.length || course.studentsEnrolled?.length || 0;
      });

      const reviews = await Review.find({
        $or: [
          { teacherId: teacher._id },
          { courseId: { $in: courseIds } }
        ]
      });

      let averageRating = 0;
      if (reviews.length > 0) {
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        averageRating = Number((sum / reviews.length).toFixed(1));
      }

      return {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        profileImage: teacher.profileImage,
        bio: teacher.bio || '',
        skills: teacher.skills || [],
        experience: teacher.experience || '',
        courseCount,
        studentCount,
        rating: averageRating,
        reviewCount: reviews.length
      };
    })
  );

  res.json(teachersWithStats);
});

// @desc    Get teacher profile by ID with detailed course listing
// @route   GET /api/teachers/:id
// @access  Public
const getTeacherById = asyncHandler(async (req, res) => {
  const teacher = await User.findOne({ _id: req.params.id, role: 'instructor' }).select('-password');

  if (!teacher) {
    res.status(404);
    throw new Error('Teacher not found');
  }

  const courses = await Course.find({ instructor: teacher._id, isPublished: true })
    .populate('instructor', 'name email profileImage')
    .populate('lessons');

  const courseIds = courses.map((c) => c._id);
  let studentCount = 0;

  courses.forEach((course) => {
    studentCount += course.enrolledStudents?.length || course.studentsEnrolled?.length || 0;
  });

  const reviews = await Review.find({
    $or: [
      { teacherId: teacher._id },
      { courseId: { $in: courseIds } }
    ]
  }).populate('userId', 'name profileImage');

  let averageRating = 0;
  if (reviews.length > 0) {
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    averageRating = Number((sum / reviews.length).toFixed(1));
  }

  res.json({
    teacher: {
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      profileImage: teacher.profileImage,
      bio: teacher.bio || '',
      skills: teacher.skills || [],
      experience: teacher.experience || ''
    },
    stats: {
      courseCount: courses.length,
      studentCount,
      rating: averageRating,
      reviewCount: reviews.length
    },
    courses,
    reviews
  });
});

module.exports = {
  getTeachers,
  getTeacherById
};
