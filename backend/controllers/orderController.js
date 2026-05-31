const Course = require('../models/Course');
const Order = require('../models/Order');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const createOrder = asyncHandler(async (req, res) => {
  const { courseId, paymentProvider = 'manual' } = req.body;
  const course = await Course.findById(courseId);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const order = await Order.create({
    amount: course.price,
    courseId: course._id,
    paymentProvider,
    paymentStatus: 'pending',
    userId: req.user._id
  });

  res.status(201).json({
    order,
    paymentPreparation: {
      stripeReady: paymentProvider === 'stripe',
      payHereReady: paymentProvider === 'payhere',
      message: 'Order created. Connect Stripe or PayHere payment intent/session logic here.'
    }
  });
});

const markOrderPaid = asyncHandler(async (req, res) => {
  const { transactionId } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.paymentStatus = 'paid';
  order.transactionId = transactionId || `manual-${Date.now()}`;
  await order.save();

  const Enrollment = require('../models/Enrollment');
  
  // Check if already enrolled to prevent duplicates
  const existingEnrollment = await Enrollment.findOne({
    student: order.userId,
    course: order.courseId
  });

  if (!existingEnrollment) {
    await Enrollment.create({
      student: order.userId,
      course: order.courseId,
      progress: 0,
      completedLessons: [],
      enrolledAt: new Date()
    });

    // Update Course: add student and increment enrollmentCount
    await Course.findByIdAndUpdate(order.courseId, {
      $addToSet: {
        studentsEnrolled: order.userId,
        enrolledStudents: order.userId
      },
      $inc: { enrollmentCount: 1 }
    });
  }

  // Update User: add course
  await User.findByIdAndUpdate(order.userId, {
    $addToSet: { enrolledCourses: order.courseId }
  });

  res.json(order);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
    .populate('courseId', 'title thumbnail price')
    .sort({ createdAt: -1 });

  res.json(orders);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('userId', 'name email')
    .populate('courseId', 'title price')
    .sort({ createdAt: -1 });

  res.json(orders);
});

module.exports = { createOrder, getAllOrders, getMyOrders, markOrderPaid };
