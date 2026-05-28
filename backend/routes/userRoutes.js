const express = require('express');
const { deleteUser, getUserProfile, getUsers, updateUserProfile } = require('../controllers/userController');
const { authorizeRoles, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, authorizeRoles('admin'), getUsers);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);

module.exports = router;
