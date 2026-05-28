const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required']
    },
    duration: {
      type: String,
      default: ''
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Lesson', lessonSchema);
