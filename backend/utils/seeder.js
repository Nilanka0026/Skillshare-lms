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

  const student = await upsertDemoUser(
    'Demo Student',
    'student@skillshare.test',
    'student',
    'Passionate learner exploring advanced web architectures.'
  );

  const instructor = await upsertDemoUser(
    'Instructor',
    'instructor@skillshare.test',
    'instructor',
    ' with 15+ years of software design experience. Tech educator and advisor.',
    ['Programming', 'Web Development', 'Cloud Computing', 'System Architectures'],
    'Senior Staff Software Engineer & Educator'
  );

  await upsertDemoUser(
    'Demo Admin',
    'admin@skillshare.test',
    'admin'
  );

  let course = await Course.findOne({ title: 'Product Design Foundations' });

  if (!course) {
    course = await Course.create({
      title: 'Product Design Foundations',
      description: 'Learn practical UI and product design through hands-on workflows and portfolio-ready projects.',
      price: 49,
      thumbnail: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80',
      category: 'Design',
      instructor: instructor._id,
      level: 'Beginner',
      duration: '8h 20m',
      requirements: ['Figma basic tool knowledge', 'Desire to learn user interface fundamentals'],
      learningOutcomes: ['Master design thinking principles', 'Create responsive mobile and desktop wireframes'],
      isPublished: true,
      rating: 5,
      reviewCount: 1,
      enrollmentCount: 1
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
    course.enrolledStudents = [student._id];
    course.ratings = { average: 5, count: 1 };
    await course.save();

    // Create an enrollment record in Enrollment collection
    await Enrollment.create({
      student: student._id,
      course: course._id,
      progress: 68,
      completedLessons: [lessons[0]._id, lessons[1]._id],
      enrolledAt: new Date()
    });
  }

  // Update teacher's createdCourses list
  await User.findByIdAndUpdate(instructor._id, {
    $addToSet: { createdCourses: course._id }
  });

  // Update student's enrolledCourses list
  await User.findByIdAndUpdate(student._id, {
    $addToSet: { enrolledCourses: course._id }
  });

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

async function upsertDemoUser(name, email, role, bio = '', skills = [], experience = '') {
  let user = await User.findOne({ email }).select('+password');

  if (!user) {
    return User.create({
      name,
      email,
      password: 'password123',
      role,
      bio,
      skills,
      experience
    });
  }

  user.name = name;
  user.role = role;
  user.password = 'password123';
  user.bio = bio || user.bio;
  user.skills = skills.length ? skills : user.skills;
  user.experience = experience || user.experience;
  await user.save();
  return user;
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
