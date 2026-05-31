const express = require('express');
const {
  createTeacherCourse,
  deleteTeacherCourse,
  getCourseStudents,
  getTeacherAnalytics,
  getTeacherCourses,
  updateTeacherCourse
} = require('../controllers/teacherDashboardController');
const { authorizeRoles, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('instructor', 'admin'));

router.route('/courses')
  .get(getTeacherCourses)
  .post(createTeacherCourse);

router.route('/courses/:id')
  .put(updateTeacherCourse)
  .delete(deleteTeacherCourse);

router.get('/students/:courseId', getCourseStudents);
router.get('/analytics', getTeacherAnalytics);

module.exports = router;
