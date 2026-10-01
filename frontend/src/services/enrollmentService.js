import apiClient from './apiClient';

export const enrollmentService = {
  checkStatus: (courseId) => apiClient.get(`/enroll/${courseId}`),
  enroll: (courseId) => apiClient.post(`/enroll/${courseId}`),
  unenroll: (courseId) => apiClient.delete(`/enroll/${courseId}`),
  markLessonComplete: (courseId, lessonId) => apiClient.post(`/enroll/${courseId}/lessons/${lessonId}/complete`)
};

export default enrollmentService;
