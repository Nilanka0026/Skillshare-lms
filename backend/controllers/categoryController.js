const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');

const defaultCategories = [
  "Programming",
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Artificial Intelligence",
  "Machine Learning",
  "Cyber Security",
  "Cloud Computing",
  "Networking",
  "Electronics",
  "Engineering",
  "Business",
  "Marketing",
  "Finance",
  "Design",
  "Photography",
  "Video Editing",
  "Music",
  "Language Learning",
  "Personal Development"
];

// @desc    Get all categories (auto-seed if empty)
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  let categoriesList = await Category.find().sort({ name: 1 });

  if (categoriesList.length === 0) {
    // Seed default categories in database
    await Category.insertMany(defaultCategories.map(name => ({ name })));
    categoriesList = await Category.find().sort({ name: 1 });
  }

  res.json(categoriesList.map(c => c.name));
});

// @desc    Get raw categories with IDs for admin list
// @route   GET /api/categories/raw
// @access  Private (admin only)
const getRawCategories = asyncHandler(async (req, res) => {
  let list = await Category.find().sort({ name: 1 });
  if (list.length === 0) {
    await Category.insertMany(defaultCategories.map(name => ({ name })));
    list = await Category.find().sort({ name: 1 });
  }
  res.json(list);
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private (admin only)
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const exists = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  if (exists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = await Category.create({ name });
  res.status(201).json(category);
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (admin only)
const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const exists = await Category.findOne({ 
    name: { $regex: new RegExp(`^${name}$`, 'i') },
    _id: { $ne: req.params.id }
  });
  
  if (exists) {
    res.status(400);
    throw new Error('Another category with this name already exists');
  }

  category.name = name;
  const updated = await category.save();
  res.json(updated);
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (admin only)
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  await category.deleteOne();
  res.json({ message: 'Category deleted successfully' });
});

module.exports = {
  getCategories,
  getRawCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
