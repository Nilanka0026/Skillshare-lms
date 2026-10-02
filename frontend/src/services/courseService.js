import apiClient from './apiClient';

export const courseService = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/courses${query ? `?${query}` : ''}`);
  },
  details: (id) => apiClient.get(`/courses/${id}`),
  myCourses: () => apiClient.get('/student/my-courses'),
  create: (payload) => apiClient.post('/courses', payload),
  update: (id, payload) => apiClient.put(`/courses/${id}`, payload),
  remove: (id) => apiClient.delete(`/courses/${id}`),
  addLesson: (courseId, payload) => apiClient.post(`/courses/${courseId}/lessons`, payload),
  removeLesson: (courseId, lessonId) => apiClient.delete(`/courses/${courseId}/lessons/${lessonId}`),
  addQuiz: (courseId, payload) => apiClient.post(`/courses/${courseId}/quizzes`, payload),
  updateQuiz: (courseId, quizId, payload) => apiClient.patch(`/courses/${courseId}/quizzes/${quizId}`, payload),
  removeQuiz: (courseId, quizId) => apiClient.delete(`/courses/${courseId}/quizzes/${quizId}`),
  startQuizAttempt: (courseId, quizId) => apiClient.post(`/courses/${courseId}/quizzes/${quizId}/attempts`),
  submitQuizAttempt: (courseId, quizId, attemptId, answers) => apiClient.post(`/courses/${courseId}/quizzes/${quizId}/attempts/${attemptId}/submit`, { answers }),
  quizAttempts: (courseId, quizId) => apiClient.get(`/courses/${courseId}/quizzes/${quizId}/attempts`),
  quizAttempt: (courseId, quizId, attemptId) => apiClient.get(`/courses/${courseId}/quizzes/${quizId}/attempts/${attemptId}`),
  studentQuizAttempts: () => apiClient.get('/student/quiz-attempts'),
  adminQuizzes: () => apiClient.get('/admin/quizzes'),
  addReview: (courseId, payload) => apiClient.post(`/courses/${courseId}/reviews`, payload),
  uploadVideo: (file) => {
    const formData = new FormData();
    formData.append('video', file);
    return apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // New Teacher APIs
  teacherCourses: () => apiClient.get('/teacher/courses'),
  teacherCreate: (payload) => apiClient.post('/teacher/courses', payload),
  teacherUpdate: (id, payload) => apiClient.put(`/teacher/courses/${id}`, payload),
  teacherRemove: (id) => apiClient.delete(`/teacher/courses/${id}`),
  teacherStudents: (courseId) => apiClient.get(`/teacher/students/${courseId}`),
  teacherAnalytics: () => apiClient.get('/teacher/analytics'),
  submitQuiz: (courseId, quizId, answers) => apiClient.post(`/courses/${courseId}/quizzes/${quizId}/submit`, { answers })
};

export default courseService;
