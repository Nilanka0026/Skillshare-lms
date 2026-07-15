const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5174',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'SkillShare API is running',
    routes: ['/api/auth', '/api/users', '/api/courses', '/api/orders']
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/enroll', require('./routes/enrollmentRoutes'));
app.use('/api/instructor', require('./routes/instructorRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/teachers', require('./routes/teacherPublicRoutes'));
app.use('/api/teacher', require('./routes/teacherDashboardRoutes'));
app.use('/api/student', require('./routes/studentDashboardRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes')); // Gemini Chatbot route

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Stop the existing process or change PORT in backend/.env.`);
      process.exit(1);
    }

    throw error;
  });
};

startServer();
