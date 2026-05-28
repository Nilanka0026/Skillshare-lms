const express = require('express');
const { createOrder, getAllOrders, getMyOrders, markOrderPaid } = require('../controllers/orderController');
const { authorizeRoles, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorizeRoles('student'), createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, authorizeRoles('admin'), getAllOrders);
router.patch('/:id/pay', protect, markOrderPaid);

module.exports = router;
