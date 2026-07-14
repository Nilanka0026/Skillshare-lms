const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');

const sendAuthResponse = (res, user, statusCode = 200) => {
  res.status(statusCode).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    verificationStatus: user.verificationStatus,
    verificationDocuments: user.verificationDocuments,
    profileImage: user.profileImage,
    token: generateToken(user._id)
  });
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, name, password, role, verificationDocuments } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  if (role === 'instructor') {
    if (!verificationDocuments || !verificationDocuments.instructorId) {
      res.status(400);
      throw new Error('Instructor ID verification document is required for instructor registration');
    }
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'student',
    verificationStatus: role === 'instructor' ? 'pending' : 'none',
    verificationDocuments: role === 'instructor' ? {
      instructorId: verificationDocuments.instructorId,
      degreeQualifications: verificationDocuments.degreeQualifications || ''
    } : undefined
  });

  sendAuthResponse(res, user, 201);
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  sendAuthResponse(res, user);
});

const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { getMe, loginUser, registerUser };
