const express = require('express');
const { getTeacherById, getTeachers } = require('../controllers/teacherPublicController');

const router = express.Router();

router.get('/', getTeachers);
router.get('/:id', getTeacherById);

module.exports = router;
