import apiClient from './apiClient';

export const enrollmentService = {
  enroll: (courseId) => apiClient.post(`/enroll/${courseId}`)
};

export default enrollmentService;
