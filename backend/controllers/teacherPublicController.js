const User = require('../models/User');
const Course = require('../models/Course');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all teachers with calculated stats
// @route   GET /api/teachers
// @access  Public
const getTeachers = asyncHandler(async (req, res) => {
  const teachers = await User.find({ role: 'instructor' }).select('-password');
  
  const teachersWithStats = await Promise.all(
    teachers.map(async (teacher) => {
      const courses = await Course.find({ instructor: teacher._id });
      
      const courseCount = courses.length;
      let studentCount = 0;
      let ratingSum = 0;
      let ratedCoursesCount = 0;

      courses.forEach((course) => {
        studentCount += course.enrolledStudents?.length || course.studentsEnrolled?.length || 0;
        
        const avg = course.rating || course.ratings?.average || 0;
        if (avg > 0) {
          ratingSum += avg;
          ratedCoursesCount += 1;
        }
      });

      const averageRating = ratedCoursesCount > 0 ? Number((ratingSum / ratedCoursesCount).toFixed(1)) : 0;

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
        rating: averageRating || 5.0 // fallback default to make it look active
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

  let studentCount = 0;
  let ratingSum = 0;
  let ratedCoursesCount = 0;

  courses.forEach((course) => {
    studentCount += course.enrolledStudents?.length || course.studentsEnrolled?.length || 0;
    
    const avg = course.rating || course.ratings?.average || 0;
    if (avg > 0) {
      ratingSum += avg;
      ratedCoursesCount += 1;
    }
  });

  const averageRating = ratedCoursesCount > 0 ? Number((ratingSum / ratedCoursesCount).toFixed(1)) : 5.0;

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
      rating: averageRating
    },
    courses
  });
});

module.exports = {
  getTeachers,
  getTeacherById
};
