const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Order = require('../models/Order');
const Review = require('../models/Review');
const User = require('../models/User');

dotenv.config();

const seed = async () => {
  await connectDB();

  const student = await upsertDemoUser('Demo Student', 'student@skillshare.test', 'student');
  const instructor = await upsertDemoUser('Demo Instructor', 'instructor@skillshare.test', 'instructor');
  await upsertDemoUser('Demo Admin', 'admin@skillshare.test', 'admin');

  let course = await Course.findOne({ title: 'Product Design Foundations' });

  if (!course) {
    course = await Course.create({
      title: 'Product Design Foundations',
      description: 'Learn practical UI and product design through hands-on workflows and portfolio-ready projects.',
      price: 49,
      thumbnail: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80',
      category: 'Design',
      instructor: instructor._id
    });

    const lessons = await Lesson.insertMany([
      {
        title: 'Design thinking basics',
        videoUrl: 'https://example.com/video/design-thinking',
        duration: '18 min',
        courseId: course._id
      },
      {
        title: 'User research',
        videoUrl: 'https://example.com/video/user-research',
        duration: '24 min',
        courseId: course._id
      },
      {
        title: 'Portfolio project',
        videoUrl: 'https://example.com/video/portfolio-project',
        duration: '32 min',
        courseId: course._id
      }
    ]);

    course.lessons = lessons.map((lesson) => lesson._id);
    course.studentsEnrolled = [student._id];
    course.ratings = { average: 5, count: 1 };
    await course.save();
  }

  await Review.findOne({ userId: student._id, courseId: course._id }) || await Review.create({
    userId: student._id,
    courseId: course._id,
    rating: 5,
    comment: 'Clear lessons and useful projects.'
  });

  console.log('Seed data created.');
  console.log('Student: student@skillshare.test / password123');
  console.log('Instructor: instructor@skillshare.test / password123');
  console.log('Admin: admin@skillshare.test / password123');

  process.exit(0);
};

async function upsertDemoUser(name, email, role) {
  let user = await User.findOne({ email }).select('+password');

  if (!user) {
    return User.create({
      name,
      email,
      password: 'password123',
      role
    });
  }

  user.name = name;
  user.role = role;
  user.password = 'password123';
  await user.save();
  return user;
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
