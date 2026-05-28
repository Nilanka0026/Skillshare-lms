const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Review = require('../models/Review');
const asyncHandler = require('../utils/asyncHandler');

const getCourses = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const query = {};

  if (category) {
    query.category = category;
  }

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  const courses = await Course.find(query)
    .populate('instructor', 'name email profileImage')
    .populate('lessons');

  res.json(courses);
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'name email profileImage')
    .populate('lessons')
    .populate('studentsEnrolled', 'name email');

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const reviews = await Review.find({ courseId: course._id }).populate('userId', 'name profileImage');

  res.json({ course, reviews });
});

const getMyCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({
    studentsEnrolled: req.user._id
  })
    .populate('instructor', 'name email profileImage')
    .populate('lessons');

  res.json(courses);
});

const createCourse = asyncHandler(async (req, res) => {
  const { category, description, price, thumbnail, title } = req.body;

  const course = await Course.create({
    category,
    description,
    instructor: req.user._id,
    price,
    thumbnail,
    title
  });

  res.status(201).json(course);
});

const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Forbidden: you can only update your own courses');
  }

  Object.assign(course, req.body);
  const updatedCourse = await course.save();

  res.json(updatedCourse);
});

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  await course.deleteOne();
  res.json({ message: 'Course deleted successfully' });
});

const addLesson = asyncHandler(async (req, res) => {
  const { duration, title, videoUrl } = req.body;
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Forbidden: you can only add lessons to your own courses');
  }

  const lesson = await Lesson.create({
    courseId: course._id,
    duration,
    title,
    videoUrl
  });

  course.lessons.push(lesson._id);
  await course.save();

  res.status(201).json(lesson);
});

const addReview = asyncHandler(async (req, res) => {
  const { comment, rating } = req.body;
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const review = await Review.create({
    comment,
    courseId: course._id,
    rating,
    userId: req.user._id
  });

  const reviews = await Review.find({ courseId: course._id });
  course.ratings.count = reviews.length;
  course.ratings.average = reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;
  await course.save();

  res.status(201).json(review);
});

module.exports = {
  addLesson,
  addReview,
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  getMyCourses,
  updateCourse
};
