const express = require('express');
const { 
  getCategories, 
  getRawCategories,
  createCategory, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/categoryController');
const { authorizeRoles, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getCategories);

// Admin-only CRUD actions
router.get('/raw', protect, authorizeRoles('admin'), getRawCategories);
router.post('/', protect, authorizeRoles('admin'), createCategory);
router.put('/:id', protect, authorizeRoles('admin'), updateCategory);
router.delete('/:id', protect, authorizeRoles('admin'), deleteCategory);

module.exports = router;
