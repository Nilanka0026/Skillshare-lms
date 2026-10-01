const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('../config/db');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Review = require('../models/Review');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

const seed = async () => {
  await connectDB();

  const student = await upsertDemoUser(
    'Alex Morgan',
    'student@skillshare.test',
    'student',
    'Passionate learner exploring advanced web architectures and data engineering.'
  );

  const instructor1 = await upsertDemoUser(
    'Dr. Sarah Jenkins',
    'instructor@skillshare.test',
    'instructor',
    'Senior Staff Software Engineer & Educator with 12+ years building distributed cloud architectures.',
    ['Web Development', 'React', 'Node.js', 'System Architecture'],
    'Lead Engineer & University Lecturer'
  );

  const instructor2 = await upsertDemoUser(
    'Michael Chen',
    'mchen@skillshare.test',
    'instructor',
    'Lead Product Designer with expertise in Design Systems, UX Research, and interactive prototypes.',
    ['Product Design', 'UI/UX', 'Figma', 'Design Systems'],
    'Principal UX Designer'
  );

  await upsertDemoUser(
    'Admin User',
    'admin@skillshare.test',
    'admin'
  );

  const coursesToSeed = [
    {
      title: 'Full-Stack Web Development Boot Camp',
      description: 'Build modern responsive applications using React, Node.js, Express, and MongoDB with clean architecture.',
      price: 89,
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
      category: 'Web Development',
      instructor: instructor1._id,
      level: 'All levels',
      duration: '14h 30m',
      requirements: ['Basic HTML, CSS, JavaScript'],
      learningOutcomes: ['Build REST APIs with Node and Express', 'Create dynamic frontend UI with React', 'Deploy full-stack web applications'],
      isPublished: true,
      lessons: [
        { title: 'Intro to Full-Stack Architecture', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '15 min' },
        { title: 'Building RESTful APIs with Node.js', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '30 min' },
        { title: 'State Management in React', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '45 min' }
      ]
    },
    {
      title: 'Product Design & UI/UX Foundations',
      description: 'Learn practical UI and product design through hands-on workflows, Figma component libraries, and portfolio projects.',
      price: 49,
      thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1000&q=80',
      category: 'Design',
      instructor: instructor2._id,
      level: 'Beginner',
      duration: '8h 20m',
      requirements: ['Figma basic tool knowledge'],
      learningOutcomes: ['Master design thinking principles', 'Create responsive mobile & desktop wireframes'],
      isPublished: true,
      lessons: [
        { title: 'Design Thinking Basics', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '18 min' },
        { title: 'User Research & Wireframing', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '24 min' },
        { title: 'High-Fidelity Component Systems', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '32 min' }
      ]
    },
    {
      title: 'Data Science & Machine Learning Masterclass',
      description: 'Master Python data analysis, pandas, NumPy, and machine learning models for real-world decision making.',
      price: 99,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
      category: 'Data Science',
      instructor: instructor1._id,
      level: 'Intermediate',
      duration: '18h 45m',
      requirements: ['Basic Python programming skills'],
      learningOutcomes: ['Analyze large datasets with Pandas', 'Train predictive models with Scikit-learn'],
      isPublished: true,
      lessons: [
        { title: 'Python for Data Analysis', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '25 min' },
        { title: 'Exploratory Data Analysis', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '35 min' },
        { title: 'Supervised Learning Algorithms', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '50 min' }
      ]
    },
    {
      title: 'Cloud DevOps & AWS Infrastructure',
      description: 'Automate deployments, setup CI/CD pipelines, Docker containers, and scalable AWS Cloud infrastructure.',
      price: 79,
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
      category: 'DevOps',
      instructor: instructor1._id,
      level: 'Advanced',
      duration: '11h 10m',
      requirements: ['Command line familiarity'],
      learningOutcomes: ['Containerize apps using Docker', 'Setup GitHub Actions CI/CD', 'Deploy scalable AWS EC2 & S3 instances'],
      isPublished: true,
      lessons: [
        { title: 'Docker Essentials & Multi-stage Builds', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '20 min' },
        { title: 'AWS Cloud Architecture Fundamentals', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '40 min' }
      ]
    }
  ];

  for (const item of coursesToSeed) {
    let course = await Course.findOne({ title: item.title });

    if (!course) {
      // Create course object first
      course = await Course.create({
        title: item.title,
        description: item.description,
        price: item.price,
        thumbnail: item.thumbnail,
        category: item.category,
        instructor: item.instructor,
        level: item.level,
        duration: item.duration,
        requirements: item.requirements,
        learningOutcomes: item.learningOutcomes,
        isPublished: true,
        studentsEnrolled: [student._id],
        enrolledStudents: [student._id],
        enrollmentCount: 1,
        ratings: { average: 5.0, count: 1 },
        rating: 5.0,
        reviewCount: 1
      });

      const lessonDocs = await Lesson.insertMany(
        item.lessons.map((l) => ({
          title: l.title,
          videoUrl: l.videoUrl,
          duration: l.duration,
          courseId: course._id
        }))
      );

      course.lessons = lessonDocs.map((l) => l._id);
      await course.save();

      // Create enrollment record
      await Enrollment.create({
        student: student._id,
        course: course._id,
        progress: 50,
        completedLessons: [course.lessons[0]],
        enrolledAt: new Date()
      });

      // Create initial review
      await Review.create({
        userId: student._id,
        courseId: course._id,
        teacherId: item.instructor,
        rating: 5,
        comment: 'Outstanding course with clear step-by-step guidance!'
      });

      await User.findByIdAndUpdate(item.instructor, {
        $addToSet: { createdCourses: course._id }
      });

      await User.findByIdAndUpdate(student._id, {
        $addToSet: { enrolledCourses: course._id }
      });
    }
  }

  console.log('Seed data created successfully.');
  console.log('Student: student@skillshare.test / password123');
  console.log('Instructor 1: instructor@skillshare.test / password123');
  console.log('Instructor 2: mchen@skillshare.test / password123');
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
      verificationStatus: role === 'instructor' ? 'approved' : 'none',
      bio,
      skills,
      experience
    });
  }

  user.name = name;
  user.role = role;
  if (role === 'instructor') {
    user.verificationStatus = 'approved';
  }
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
