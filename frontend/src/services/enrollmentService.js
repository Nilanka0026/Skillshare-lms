import apiClient from './apiClient';

export const enrollmentService = {
  enroll: (courseId) => apiClient.post(`/enroll/${courseId}`),
  unenroll: (courseId) => apiClient.delete(`/enroll/${courseId}`)
};

export default enrollmentService;
