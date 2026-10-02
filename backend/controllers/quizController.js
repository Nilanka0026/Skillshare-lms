const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const QuizAttempt = require('../models/QuizAttempt');
const asyncHandler = require('../utils/asyncHandler');

const fail = (res, status, message) => {
  res.status(status);
  throw new Error(message);
};

const toQuizObject = (quiz) => (quiz.toObject ? quiz.toObject() : quiz);

const sanitizeQuiz = (quiz) => {
  const quizData = toQuizObject(quiz);
  return {
    ...quizData,
    questions: quizData.questions.map(({ correctAnswerIndex, ...question }) => question)
  };
};

const sanitizeCourseQuizzes = (course) => {
  const courseData = course.toObject ? course.toObject() : { ...course };
  courseData.quizzes = (courseData.quizzes || [])
    .filter((quiz) => quiz.isPublished !== false)
    .map(sanitizeQuiz);
  return courseData;
};

const normalizeQuiz = (payload, res) => {
  const title = typeof payload.title === 'string' ? payload.title.trim() : '';
  if (!title) fail(res, 400, 'Quiz title is required');
  if (!Array.isArray(payload.questions) || payload.questions.length === 0) {
    fail(res, 400, 'A quiz must contain at least one question');
  }

  const questions = payload.questions.map((question, index) => {
    const questionText = typeof question.questionText === 'string' ? question.questionText.trim() : '';
    const questionType = question.questionType || 'multiple-choice';
    const marks = Number(question.marks ?? 1);
    const correctAnswerIndex = Number(question.correctAnswerIndex);
    if (!questionText) fail(res, 400, `Question ${index + 1} text is required`);
    if (!['multiple-choice', 'true-false'].includes(questionType)) {
      fail(res, 400, `Question ${index + 1} has an unsupported type`);
    }
    if (!Number.isFinite(marks) || marks <= 0) fail(res, 400, `Question ${index + 1} must have positive marks`);

    const options = questionType === 'true-false'
      ? ['True', 'False']
      : Array.isArray(question.options)
        ? question.options.map((option) => String(option).trim())
        : [];
    if (options.length < 2 || options.some((option) => !option)) {
      fail(res, 400, `Question ${index + 1} must have at least two non-empty options`);
    }
    if (questionType === 'true-false' && options.length !== 2) {
      fail(res, 400, `Question ${index + 1} must have two answers`);
    }
    if (!Number.isInteger(correctAnswerIndex) || correctAnswerIndex < 0 || correctAnswerIndex >= options.length) {
      fail(res, 400, `Question ${index + 1} must have a valid correct answer`);
    }

    return { questionText, questionType, options, correctAnswerIndex, marks };
  });

  const passMark = Number(payload.passMark ?? 50);
  if (!Number.isFinite(passMark) || passMark < 0 || passMark > 100) {
    fail(res, 400, 'Pass mark must be a percentage from 0 to 100');
  }

  const parsePositiveInteger = (value, label) => {
    if (value === null || value === undefined || value === '') return null;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1) fail(res, 400, `${label} must be a positive whole number`);
    return parsed;
  };

  const parseDate = (value, label) => {
    if (value === null || value === undefined || value === '') return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) fail(res, 400, `${label} is not a valid date`);
    return parsed;
  };

  const startsAt = parseDate(payload.startsAt, 'Start date');
  const endsAt = parseDate(payload.endsAt, 'End date');
  if (startsAt && endsAt && endsAt <= startsAt) fail(res, 400, 'End date must be after start date');

  let isPublished = true;
  if (payload.isPublished !== undefined) {
    if (typeof payload.isPublished === 'boolean') {
      isPublished = payload.isPublished;
    } else if (payload.isPublished === 'true' || payload.isPublished === 'false') {
      isPublished = payload.isPublished === 'true';
    } else {
      fail(res, 400, 'Published state must be true or false');
    }
  }

  return {
    title,
    questions,
    passMark,
    timeLimitMinutes: parsePositiveInteger(payload.timeLimitMinutes, 'Time limit'),
    attemptLimit: parsePositiveInteger(payload.attemptLimit, 'Attempt limit'),
    startsAt,
    endsAt,
    isPublished
  };
};

const findManagedCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) fail(res, 404, 'Course not found');
  if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
    fail(res, 403, 'You can manage quizzes only for your own courses');
  }
  return course;
};

const createQuiz = asyncHandler(async (req, res) => {
  const course = await findManagedCourse(req, res);
  const quiz = normalizeQuiz(req.body, res);
  course.quizzes.push(quiz);
  await course.save();
  res.status(201).json(course.quizzes[course.quizzes.length - 1]);
});

const updateQuiz = asyncHandler(async (req, res) => {
  const course = await findManagedCourse(req, res);
  const quiz = course.quizzes.id(req.params.quizId);
  if (!quiz) fail(res, 404, 'Quiz not found');
  const current = toQuizObject(quiz);
  const updated = normalizeQuiz({ ...current, ...req.body }, res);
  Object.assign(quiz, updated);
  await course.save();
  res.json(quiz);
});

const deleteQuiz = asyncHandler(async (req, res) => {
  const course = await findManagedCourse(req, res);
  const quiz = course.quizzes.id(req.params.quizId);
  if (!quiz) fail(res, 404, 'Quiz not found');
  course.quizzes.pull(req.params.quizId);
  await course.save();
  res.json({ message: 'Quiz deleted successfully' });
});

const listAdminQuizzes = asyncHandler(async (req, res) => {
  const courses = await Course.find({})
    .select('title instructor quizzes')
    .populate('instructor', 'name email')
    .sort({ title: 1 });
  res.json(courses);
});

const startQuizAttempt = asyncHandler(async (req, res) => {
  const { id: courseId, quizId } = req.params;
  const course = await Course.findById(courseId);
  if (!course) fail(res, 404, 'Course not found');
  const quiz = course.quizzes.id(quizId);
  if (!quiz) fail(res, 404, 'Quiz not found');
  if (!quiz.isPublished) fail(res, 403, 'This quiz is not available');
  const now = new Date();
  if (quiz.startsAt && now < quiz.startsAt) fail(res, 403, 'This quiz is not open yet');
  if (quiz.endsAt && now > quiz.endsAt) fail(res, 403, 'The quiz submission window has ended');

  const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
  if (!enrollment) fail(res, 403, 'You must be enrolled in this course to attempt its quizzes');

  const attemptCount = await QuizAttempt.countDocuments({
    student: req.user._id,
    course: courseId,
    quizId
  });
  if (quiz.attemptLimit && attemptCount >= quiz.attemptLimit) {
    fail(res, 403, 'You have reached the attempt limit for this quiz');
  }

  const totalMarks = quiz.questions.reduce((sum, question) => sum + Number(question.marks || 1), 0);
  const attempt = await QuizAttempt.create({
    student: req.user._id,
    course: courseId,
    quizId,
    attemptNumber: attemptCount + 1,
    quizTitle: quiz.title,
    questions: quiz.questions.map((question) => ({
      questionId: question._id,
      questionText: question.questionText,
      questionType: question.questionType || 'multiple-choice',
      options: question.questionType === 'true-false' ? ['True', 'False'] : question.options,
      correctAnswerIndex: question.correctAnswerIndex,
      marks: question.marks || 1
    })),
    passMark: quiz.passMark ?? 50,
    totalMarks,
    deadlineAt: quiz.timeLimitMinutes ? new Date(now.getTime() + quiz.timeLimitMinutes * 60000) : null
  });

  res.status(201).json({
    attemptId: attempt._id,
    attemptNumber: attempt.attemptNumber,
    quizTitle: attempt.quizTitle,
    passMark: attempt.passMark,
    totalMarks: attempt.totalMarks,
    startedAt: attempt.startedAt,
    deadlineAt: attempt.deadlineAt,
    questions: attempt.questions.map(({ correctAnswerIndex, ...question }) => question)
  });
});

const submitQuizAttempt = asyncHandler(async (req, res) => {
  const { id: courseId, quizId, attemptId } = req.params;
  const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
  if (!enrollment) fail(res, 403, 'You must be enrolled in this course to submit a quiz');

  const attempt = await QuizAttempt.findOne({
    _id: attemptId,
    student: req.user._id,
    course: courseId,
    quizId
  });
  if (!attempt) fail(res, 404, 'Quiz attempt not found');
  if (attempt.status !== 'in-progress') fail(res, 409, 'This quiz attempt has already been submitted');

  const { answers } = req.body;
  if (!Array.isArray(answers) || answers.length !== attempt.questions.length
    || answers.some((answer, index) => answer !== null && answer !== -1
      && (!Number.isInteger(answer) || answer < 0 || answer >= attempt.questions[index].options.length))) {
    fail(res, 400, 'Provide one valid answer for each question');
  }

  let score = 0;
  attempt.questions.forEach((question, index) => {
    const answer = answers[index] === -1 ? null : answers[index];
    question.selectedAnswerIndex = answer;
    question.isCorrect = answer === question.correctAnswerIndex;
    question.awardedMarks = question.isCorrect ? question.marks : 0;
    score += question.awardedMarks;
  });

  const submittedAt = new Date();
  const timedOut = attempt.deadlineAt && submittedAt > attempt.deadlineAt;
  attempt.score = score;
  attempt.percentage = Math.round((score / attempt.totalMarks) * 10000) / 100;
  attempt.passed = attempt.percentage >= attempt.passMark;
  attempt.status = timedOut ? 'timed-out' : 'submitted';
  attempt.submittedAt = submittedAt;
  attempt.durationSeconds = Math.max(0, Math.floor((submittedAt - attempt.startedAt) / 1000));
  await attempt.save();

  res.json({
    attemptId: attempt._id,
    attemptNumber: attempt.attemptNumber,
    score: attempt.score,
    totalMarks: attempt.totalMarks,
    percentage: attempt.percentage,
    passMark: attempt.passMark,
    passed: attempt.passed,
    status: attempt.status,
    submittedAt: attempt.submittedAt,
    questions: attempt.questions
  });
});

const listQuizAttempts = asyncHandler(async (req, res) => {
  const course = await findManagedCourse(req, res);
  if (!course.quizzes.id(req.params.quizId)) fail(res, 404, 'Quiz not found');
  const attempts = await QuizAttempt.find({ course: course._id, quizId: req.params.quizId })
    .populate('student', 'name email')
    .sort({ startedAt: -1 });
  res.json(attempts.map((attempt) => ({
    _id: attempt._id,
    student: attempt.student,
    attemptNumber: attempt.attemptNumber,
    score: attempt.score,
    totalMarks: attempt.totalMarks,
    percentage: attempt.percentage,
    passMark: attempt.passMark,
    passed: attempt.passed,
    status: attempt.status,
    startedAt: attempt.startedAt,
    submittedAt: attempt.submittedAt
  })));
});

const getQuizAttempt = asyncHandler(async (req, res) => {
  const course = await findManagedCourse(req, res);
  const attempt = await QuizAttempt.findOne({
    _id: req.params.attemptId,
    course: course._id,
    quizId: req.params.quizId
  }).populate('student', 'name email');
  if (!attempt) fail(res, 404, 'Quiz attempt not found');
  res.json(attempt);
});

const getStudentQuizAttempts = asyncHandler(async (req, res) => {
  const attempts = await QuizAttempt.find({
    student: req.user._id,
    status: { $ne: 'in-progress' }
  })
    .populate('course', 'title')
    .sort({ submittedAt: -1 });
  res.json(attempts);
});

module.exports = {
  createQuiz,
  deleteQuiz,
  getQuizAttempt,
  getStudentQuizAttempts,
  listAdminQuizzes,
  listQuizAttempts,
  sanitizeCourseQuizzes,
  startQuizAttempt,
  submitQuizAttempt,
  updateQuiz
};
