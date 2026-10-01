const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../models/Course');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const moveQuiz = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Find the source course
    const sourceCourse = await Course.findOne({ title: /ESP32 and IoT Fundamentals/i });
    if (!sourceCourse) {
      console.log('Source course "ESP32 and IoT Fundamentals" not found');
      process.exit(1);
    }
    
    // Find the quiz to move
    const quizIndex = sourceCourse.quizzes.findIndex(q => q.title === 'Electrical Grid Concepts Assessment');
    if (quizIndex === -1) {
      console.log('Quiz "Electrical Grid Concepts Assessment" not found in source course');
      process.exit(1);
    }
    
    const quizToMove = sourceCourse.quizzes[quizIndex];
    
    // Remove quiz from source course
    sourceCourse.quizzes.splice(quizIndex, 1);
    await sourceCourse.save();
    console.log('Successfully removed quiz from "ESP32 and IoT Fundamentals"');
    
    // Find the destination course
    const destCourse = await Course.findOne({ title: /Power Systems Basics/i });
    if (!destCourse) {
      console.log('Destination course "Power Systems Basics" not found');
      process.exit(1);
    }
    
    // Add quiz to destination course
    destCourse.quizzes.push(quizToMove);
    await destCourse.save();
    console.log('Successfully added quiz to "Power Systems Basics"');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

moveQuiz();
