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
  addReview: (courseId, payload) => apiClient.post(`/courses/${courseId}/reviews`, payload),

  // New Teacher APIs
  teacherCourses: () => apiClient.get('/teacher/courses'),
  teacherCreate: (payload) => apiClient.post('/teacher/courses', payload),
  teacherUpdate: (id, payload) => apiClient.put(`/teacher/courses/${id}`, payload),
  teacherRemove: (id) => apiClient.delete(`/teacher/courses/${id}`),
  teacherStudents: (courseId) => apiClient.get(`/teacher/students/${courseId}`),
  teacherAnalytics: () => apiClient.get('/teacher/analytics')
};

export default courseService;
