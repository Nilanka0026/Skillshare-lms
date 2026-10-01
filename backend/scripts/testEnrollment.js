const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

dotenv.config({ path: './.env' });

const testEnrollment = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const course = await Course.findOne({ title: 'Fundamentals of Machine Learning' });
    if (!course) {
      console.log('Course not found');
      process.exit(1);
    }
    
    console.log('Course Lessons:', course.lessons);

    const enrollment = await Enrollment.findOne({ course: course._id });
    if (!enrollment) {
      console.log('No enrollment found for this course');
      process.exit(1);
    }

    console.log('Enrollment found for student:', enrollment.student);
    console.log('Completed Lessons Before:', enrollment.completedLessons);

    if (course.lessons.length > 0) {
      const lessonId = course.lessons[0].toString();
      if (!enrollment.completedLessons.includes(lessonId)) {
        console.log('Adding lesson to completedLessons');
        enrollment.completedLessons.push(lessonId);
        await enrollment.save();
      } else {
        console.log('Lesson already in completedLessons');
      }
    }

    const updated = await Enrollment.findById(enrollment._id);
    console.log('Completed Lessons After:', updated.completedLessons);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testEnrollment();
