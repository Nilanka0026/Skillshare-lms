const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../models/Course');
const User = require('../models/User');

dotenv.config({ path: './.env' });

const seedQuiz = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    let instructor = await User.findOne({ name: 'Aluvihare S.D.' });
    if (!instructor) {
      instructor = await User.create({
        name: 'Aluvihare S.D.',
        email: 'aluvihare@example.com',
        password: 'password123',
        role: 'instructor'
      });
      console.log('Instructor created');
    }

    let course = await Course.findOne({ title: 'Fundamentals of Machine Learning' });
    if (!course) {
      course = await Course.create({
        title: 'Fundamentals of Machine Learning',
        description: 'Learn the basics of Machine Learning.',
        price: 49.99,
        category: 'Data Science',
        instructor: instructor._id
      });
      console.log('Course created');
    }

    course.quizzes = [
      {
        title: 'Module 1 Quiz: Intro to ML',
        questions: [
          {
            questionText: 'What does ML stand for?',
            options: ['Machine Language', 'Machine Learning', 'More Learning', 'None of the above'],
            correctAnswerIndex: 1
          },
          {
            questionText: 'Which of these is a type of supervised learning?',
            options: ['Clustering', 'Classification', 'Dimensionality Reduction', 'Association'],
            correctAnswerIndex: 1
          },
          {
            questionText: 'What is the most common programming language for ML?',
            options: ['Java', 'C++', 'Python', 'Ruby'],
            correctAnswerIndex: 2
          }
        ]
      }
    ];

    await course.save();
    console.log('Quiz added to Fundamentals of Machine Learning');

    process.exit();
  } catch (error) {
    console.error('Error seeding quiz:', error);
    process.exit(1);
  }
};

seedQuiz();
