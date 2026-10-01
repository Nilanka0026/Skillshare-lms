const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../models/Course');

dotenv.config({ path: './.env' });

const removeQuiz = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const course = await Course.findOne({ title: 'Fundamentals of Machine Learning' });
    if (course) {
      course.quizzes = [];
      await course.save();
      console.log('Quizzes removed from Fundamentals of Machine Learning');
    } else {
      console.log('Course not found');
    }
    process.exit();
  } catch (error) {
    console.error('Error removing quiz:', error);
    process.exit(1);
  }
};

removeQuiz();
