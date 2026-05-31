const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const parseArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    return val.split('\n').map(s => s.trim()).filter(Boolean);
  }
  return [];
};

// @desc    Get courses created by teacher
// @route   GET /api/teacher/courses
// @access  Private (teacher only)
const getTeacherCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id })
    .populate('instructor', 'name email profileImage')
    .populate('lessons');

  res.json(courses);
});

// @desc    Create course
// @route   POST /api/teacher/courses
// @access  Private (teacher only)
const createTeacherCourse = asyncHandler(async (req, res) => {
  const {
    title,
    thumbnail,
    description,
    price,
    category,
    level,
    duration,
    requirements,
    learningOutcomes
  } = req.body;

  if (!title || !description || price === undefined || !category) {
    res.status(400);
    throw new Error('Please fill in all required fields (title, description, price, category)');
  }

  const course = await Course.create({
    title,
    thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80',
    description,
    price: Number(price),
    category,
    instructor: req.user._id,
    level: level || 'All levels',
    duration: duration || 'Self-paced',
    requirements: parseArray(requirements),
    learningOutcomes: parseArray(learningOutcomes),
    isPublished: req.body.isPublished !== undefined ? req.body.isPublished : false
  });

  // Add course to user's createdCourses
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { createdCourses: course._id }
  });

  res.status(201).json(course);
});

// @desc    Update course
// @route   PUT /api/teacher/courses/:id
// @access  Private (teacher only)
const updateTeacherCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Forbidden: you can only update your own courses');
  }

  const {
    title,
    thumbnail,
    description,
    price,
    category,
    level,
    duration,
    requirements,
    learningOutcomes,
    isPublished
  } = req.body;

  course.title = title || course.title;
  course.thumbnail = thumbnail !== undefined ? thumbnail : course.thumbnail;
  course.description = description || course.description;
  course.price = price !== undefined ? Number(price) : course.price;
  course.category = category || course.category;
  course.level = level || course.level;
  course.duration = duration || course.duration;
  
  if (requirements !== undefined) {
    course.requirements = parseArray(requirements);
  }
  if (learningOutcomes !== undefined) {
    course.learningOutcomes = parseArray(learningOutcomes);
  }
  if (isPublished !== undefined) {
    course.isPublished = isPublished;
  }

  const updatedCourse = await course.save();
  res.json(updatedCourse);
});

// @desc    Delete course
// @route   DELETE /api/teacher/courses/:id
// @access  Private (teacher only)
const deleteTeacherCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Forbidden: you can only delete your own courses');
  }

  // Remove course from teacher's createdCourses
  await User.findByIdAndUpdate(course.instructor, {
    $pull: { createdCourses: course._id }
  });

  // Pull course from any student's enrolled list and remove enrollments
  await User.updateMany(
    { enrolledCourses: course._id },
    { $pull: { enrolledCourses: course._id } }
  );
  await Enrollment.deleteMany({ course: course._id });

  await course.deleteOne();
  res.json({ message: 'Course deleted successfully' });
});

// @desc    Get enrolled students list for a course
// @route   GET /api/teacher/students/:courseId
// @access  Private (teacher only)
const getCourseStudents = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Forbidden: access denied');
  }

  const enrollments = await Enrollment.find({ course: courseId }).populate('student', 'name email');
  
  const studentList = enrollments
    .filter(enrollment => enrollment.student)
    .map(enrollment => ({
      _id: enrollment.student._id,
      name: enrollment.student.name,
      email: enrollment.student.email,
      joinDate: enrollment.enrolledAt || enrollment.createdAt,
      progressPercentage: enrollment.progress || 0
    }));

  res.json({
    courseTitle: course.title,
    totalEnrolled: studentList.length,
    students: studentList
  });
});

// @desc    Get teacher analytics
// @route   GET /api/teacher/analytics
// @access  Private (teacher only)
const getTeacherAnalytics = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id });
  const courseIds = courses.map(course => course._id);

  const totalCourses = courses.length;
  
  // Find all enrollments for this teacher's courses
  const enrollments = await Enrollment.find({ course: { $in: courseIds } })
    .populate('student', 'name email')
    .populate('course', 'title');

  const totalStudents = enrollments.length;
  const totalEnrollments = totalStudents;

  // Calculate most popular course
  let mostPopularCourse = null;
  let maxEnrolled = -1;

  courses.forEach((course) => {
    const enrollCount = course.enrolledStudents?.length || course.studentsEnrolled?.length || 0;
    if (enrollCount > maxEnrolled) {
      maxEnrolled = enrollCount;
      mostPopularCourse = {
        title: course.title,
        enrolledCount: enrollCount,
        price: course.price
      };
    }
  });

  // Get recent 5 enrollments
  const sortedEnrollments = [...enrollments]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(e => ({
      _id: e._id,
      studentName: e.student?.name || 'Unknown student',
      studentEmail: e.student?.email || '',
      courseTitle: e.course?.title || '',
      enrolledAt: e.enrolledAt || e.createdAt
    }));

  res.json({
    totalCourses,
    totalStudents,
    totalEnrollments,
    mostPopularCourse: mostPopularCourse || { title: 'None', enrolledCount: 0, price: 0 },
    recentEnrollments: sortedEnrollments
  });
});

module.exports = {
  getTeacherCourses,
  createTeacherCourse,
  updateTeacherCourse,
  deleteTeacherCourse,
  getCourseStudents,
  getTeacherAnalytics
};
