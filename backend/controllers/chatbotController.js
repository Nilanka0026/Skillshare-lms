const ChatMessage = require('../models/ChatMessage');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get chat history for the logged-in user
// @route   GET /api/chatbot/history
// @access  Private
const getChatHistory = asyncHandler(async (req, res) => {
  const messages = await ChatMessage.find({ user: req.user._id }).sort({ createdAt: 1 });
  res.json(messages);
});

// @desc    Send a message to Gemini and get a response
// @route   POST /api/chatbot/message
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === '') {
    res.status(400);
    throw new Error('Message content is required');
  }

  // 1. Save user's message
  const userMessage = await ChatMessage.create({
    user: req.user._id,
    role: 'user',
    content: message
  });

  // 2. Determine system instructions based on user role
  let systemPrompt = '';
  const role = req.user.role || 'student';

  if (role === 'instructor') {
    systemPrompt = `You are the AI Teacher Assistant on SkillShare LMS. You help teachers format their lesson plans, write course descriptions, create student quizzes, draft announcements, and improve student communication. Keep your responses professional, structured, helpful, and concise. Use markdown headers and lists where appropriate.`;
  } else if (role === 'admin') {
    systemPrompt = `You are the AI Admin Assistant on SkillShare LMS. You help administrators with operational insights, summarizing platform trends, and planning student or teacher support improvements. Keep your responses analytical, structured, direct, and concise. Use markdown headers and lists where appropriate.`;
  } else {
    // Default to student
    systemPrompt = `You are the AI Learning Assistant on SkillShare LMS. You help students find relevant courses, build weekly study schedules, explain concepts in simple terms, and offer learning tips. Structure your answers with clear markdown headers, bold text, lists, and short paragraphs. Keep it encouraging, engaging, and concise.`;
  }

  const apiKey = (process.env.GEMINI_API_KEY || '').trim();

  // 3. Fallback to Demo Mode if API Key is not set
  if (!apiKey) {
    const demoReply = `⚠️ **GEMINI_API_KEY is not configured** in the backend \`.env\` file. Running in **Demo Mode**.

You sent: *"${message}"*

To activate the live Gemini assistant:
1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2. Add \`GEMINI_API_KEY=your_api_key\` to your \`backend/.env\` file.
3. Restart the backend server.

*(For now, you are logged in as a **${role}** and I've received your request!)*`;

    const aiMessage = await ChatMessage.create({
      user: req.user._id,
      role: 'model',
      content: demoReply
    });

    res.json({
      userMessage,
      aiMessage,
      demoMode: true
    });
    return;
  }

  try {
    // 4. Fetch previous chat history (limit to last 15 messages for context window)
    const history = await ChatMessage.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(16); // limit to 16, then reverse to chronological order
    
    history.reverse();

    // 5. Format history for Gemini API
    // Gemini api structure: contents: [{ role: "user" | "model", parts: [{ text: string }] }]
    const contents = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    // If the last message in history is not our current user message (since we just created it), append it
    const lastMsgId = history[history.length - 1]?._id.toString();
    if (lastMsgId !== userMessage._id.toString()) {
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });
    }

    // 6. Make request to Gemini REST API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    // Parse generated response
    const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiReply) {
      throw new Error('Invalid or empty response from Gemini API');
    }

    // 7. Save AI response
    const aiMessage = await ChatMessage.create({
      user: req.user._id,
      role: 'model',
      content: aiReply
    });

    res.json({
      userMessage,
      aiMessage,
      demoMode: false
    });
  } catch (error) {
    console.error('Gemini Chatbot Error:', error);
    res.status(500);
    throw new Error(error.message || 'Failed to generate response from Gemini API');
  }
});

// @desc    Clear chat history for the logged-in user
// @route   DELETE /api/chatbot/history
// @access  Private
const clearChatHistory = asyncHandler(async (req, res) => {
  await ChatMessage.deleteMany({ user: req.user._id });
  res.json({ message: 'Chat history cleared successfully' });
});

module.exports = {
  getChatHistory,
  sendMessage,
  clearChatHistory
};
