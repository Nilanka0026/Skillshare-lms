const express = require('express');
const { getChatHistory, sendMessage, clearChatHistory } = require('../controllers/chatbotController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Secure all chatbot routes

router.get('/history', getChatHistory);
router.post('/message', sendMessage);
router.delete('/history', clearChatHistory);

module.exports = router;
