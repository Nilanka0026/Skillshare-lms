const crypto = require('crypto');
const Certificate = require('../models/Certificate');

const updateCourseProgress = async (enrollment, course) => {
  const lessonIds = course.lessons.map((lesson) => (lesson._id || lesson).toString());
  const quizIds = course.quizzes.map((quiz) => quiz._id.toString());
  const completedLessonIds = new Set(enrollment.completedLessons.map((lesson) => lesson.toString()));
  const completedQuizIds = new Set(enrollment.quizResults.map((result) => result.quizId.toString()));
  const completedCount = lessonIds.filter((id) => completedLessonIds.has(id)).length
    + quizIds.filter((id) => completedQuizIds.has(id)).length;
  const totalCount = lessonIds.length + quizIds.length;

  enrollment.progress = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
  enrollment.isCompleted = totalCount > 0 && completedCount === totalCount;
  enrollment.completedAt = enrollment.isCompleted ? (enrollment.completedAt || new Date()) : null;
  await enrollment.save();

  if (!enrollment.isCompleted) return null;

  try {
    return await Certificate.findOneAndUpdate(
      { student: enrollment.student, course: enrollment.course },
      {
        $setOnInsert: {
          student: enrollment.student,
          course: enrollment.course,
          certificateId: `SKL-${crypto.randomBytes(16).toString('hex').toUpperCase()}`,
          completionDate: enrollment.completedAt,
          issueDate: new Date()
        }
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
  } catch (error) {
    if (error.code !== 11000) throw error;
    const existingCertificate = await Certificate.findOne({
      student: enrollment.student,
      course: enrollment.course
    });
    if (!existingCertificate) throw error;
    return existingCertificate;
  }
};

module.exports = updateCourseProgress;
