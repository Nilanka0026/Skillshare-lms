import apiClient from './apiClient';

export const courseService = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/courses${query ? `?${query}` : ''}`);
  },
  details: (id) => apiClient.get(`/courses/${id}`),
  myCourses: () => apiClient.get('/courses/my-courses'),
  create: (payload) => apiClient.post('/courses', payload),
  update: (id, payload) => apiClient.put(`/courses/${id}`, payload),
  remove: (id) => apiClient.delete(`/courses/${id}`),
  addLesson: (courseId, payload) => apiClient.post(`/courses/${courseId}/lessons`, payload),
  addReview: (courseId, payload) => apiClient.post(`/courses/${courseId}/reviews`, payload)
};

export default courseService;
