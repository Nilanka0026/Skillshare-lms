const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    attemptNumber: {
      type: Number,
      required: true,
      min: 1
    },
    quizTitle: {
      type: String,
      required: true
    },
    questions: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        questionText: { type: String, required: true },
        questionType: { type: String, enum: ['multiple-choice', 'true-false'], required: true },
        options: [{ type: String }],
        correctAnswerIndex: { type: Number, required: true },
        selectedAnswerIndex: { type: Number, default: null },
        marks: { type: Number, required: true },
        awardedMarks: { type: Number, default: 0 },
        isCorrect: { type: Boolean, default: false }
      }
    ],
    passMark: {
      type: Number,
      required: true
    },
    totalMarks: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    },
    passed: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['in-progress', 'submitted', 'timed-out'],
      default: 'in-progress'
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    deadlineAt: {
      type: Date,
      default: null
    },
    submittedAt: {
      type: Date,
      default: null
    },
    durationSeconds: {
      type: Number,
      default: null
    }
  },
  { timestamps: true }
);

quizAttemptSchema.index(
  { student: 1, course: 1, quizId: 1, attemptNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
