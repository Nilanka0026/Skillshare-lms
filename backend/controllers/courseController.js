const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Review = require('../models/Review');
const Enrollment = require('../models/Enrollment');
const asyncHandler = require('../utils/asyncHandler');
const updateCourseProgress = require('../utils/courseProgress');
const { sanitizeCourseQuizzes } = require('./quizController');

const getCourses = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const query = {};

  if (category) {
    query.category = category;
  }

  if (search && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { category: searchRegex }
    ];
  }

  let courses = await Course.find(query)
    .populate('instructor', 'name email profileImage bio skills experience')
    .populate('lessons');

  // If search matches instructor name, include those courses as well
  if (search && search.trim() !== '') {
    const searchLower = search.trim().toLowerCase();
    const allCourses = await Course.find(category ? { category } : {})
      .populate('instructor', 'name email profileImage bio skills experience')
      .populate('lessons');

    const matchedByInstructor = allCourses.filter((course) => {
      const teacherName = course.instructor?.name || '';
      return teacherName.toLowerCase().includes(searchLower);
    });

    const combinedMap = new Map();
    [...courses, ...matchedByInstructor].forEach((c) => {
      combinedMap.set(c._id.toString(), c);
    });
    courses = Array.from(combinedMap.values());
  }

  res.json(courses.map(sanitizeCourseQuizzes));
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'name email profileImage bio skills experience')
    .populate('lessons')
    .populate('studentsEnrolled', 'name email');

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const reviews = await Review.find({ courseId: course._id }).populate('userId', 'name profileImage');

  res.json({ course: sanitizeCourseQuizzes(course), reviews });
});

const getMyCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({
    $or: [
      { studentsEnrolled: req.user._id },
      { enrolledStudents: req.user._id }
    ]
  })
    .populate('instructor', 'name email profileImage bio skills experience')
    .populate('lessons');

  res.json(courses.map(sanitizeCourseQuizzes));
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
  const numRating = Number(rating);

  if (!numRating || numRating < 1 || numRating > 5) {
    res.status(400);
    throw new Error('Please provide a valid rating between 1 and 5 stars');
  }

  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const userIdStr = req.user._id.toString();
  const isEnrolled =
    (course.studentsEnrolled && course.studentsEnrolled.some((id) => id.toString() === userIdStr)) ||
    (course.enrolledStudents && course.enrolledStudents.some((id) => id.toString() === userIdStr));

  if (!isEnrolled && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only enrolled students can rate or review this course and teacher');
  }

  let review = await Review.findOne({ courseId: course._id, userId: req.user._id });

  if (review) {
    review.rating = numRating;
    review.comment = comment || review.comment;
    review.teacherId = course.instructor;
    await review.save();
  } else {
    review = await Review.create({
      comment: comment || '',
      courseId: course._id,
      teacherId: course.instructor,
      rating: numRating,
      userId: req.user._id
    });
  }

  const reviews = await Review.find({ courseId: course._id });
  const avg = reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;
  const roundedAvg = Number(avg.toFixed(1));

  course.ratings = { average: roundedAvg, count: reviews.length };
  course.rating = roundedAvg;
  course.reviewCount = reviews.length;
  await course.save();

  res.status(201).json(review);
});

const removeLesson = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Forbidden: you can only remove lessons from your own courses');
  }

  const lesson = await Lesson.findById(req.params.lessonId);
  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  if (lesson.courseId.toString() !== course._id.toString()) {
    res.status(400);
    throw new Error('Lesson does not belong to this course');
  }

  await lesson.deleteOne();
  
  course.lessons = course.lessons.filter(
    (lessonId) => lessonId.toString() !== req.params.lessonId
  );
  await course.save();

  res.json({ message: 'Lesson removed successfully' });
});

const submitQuiz = asyncHandler(async (req, res) => {
  const { id, quizId } = req.params;
  const { answers } = req.body;

  const course = await Course.findById(id);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const quiz = course.quizzes.id(quizId);
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  if (!Array.isArray(answers)
    || answers.length !== quiz.questions.length
    || answers.some((answer, index) => !Number.isInteger(answer)
      || answer < 0
      || answer >= quiz.questions[index].options.length)) {
    res.status(400);
    throw new Error('Please answer every quiz question');
  }

  let score = 0;
  const results = quiz.questions.map((q, i) => {
    const isCorrect = answers[i] === q.correctAnswerIndex;
    if (isCorrect) score++;
    return {
      questionText: q.questionText,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      userAnswerIndex: answers[i],
      isCorrect
    };
  });

  const enrollment = await Enrollment.findOne({ student: req.user._id, course: id });
  if (!enrollment) {
    res.status(400);
    throw new Error('You are not enrolled in this course');
  }

  const existingResultIndex = enrollment.quizResults.findIndex(r => r.quizId.toString() === quizId);
  if (existingResultIndex !== -1) {
    enrollment.quizResults[existingResultIndex].score = score;
    enrollment.quizResults[existingResultIndex].total = quiz.questions.length;
  } else {
    enrollment.quizResults.push({ quizId, score, total: quiz.questions.length });
  }

  const certificate = await updateCourseProgress(enrollment, course);

  res.json({
    score,
    total: quiz.questions.length,
    results,
    progress: enrollment.progress,
    isCompleted: enrollment.isCompleted,
    completedAt: enrollment.completedAt,
    certificateId: certificate?.certificateId
  });
});

module.exports = {
  addLesson,
  addReview,
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  getMyCourses,
  removeLesson,
  updateCourse,
  submitQuiz
};
