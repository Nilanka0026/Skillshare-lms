const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }

  if (req.user.role === 'instructor') {
    if (req.user.verificationStatus === 'pending' || req.user.verificationStatus === 'none') {
      res.status(403);
      throw new Error('Verification process under going');
    }
    if (req.user.verificationStatus === 'rejected') {
      res.status(403);
      throw new Error('Verification failed');
    }
  }

  next();
});

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('Forbidden: insufficient role permissions');
    }

    next();
  };
};

module.exports = { authorizeRoles, protect };
