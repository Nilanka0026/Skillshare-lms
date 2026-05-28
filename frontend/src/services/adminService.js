import apiClient from './apiClient';

export const adminService = {
  getUsers: () => apiClient.get('/admin/users'),
  getCourses: () => apiClient.get('/admin/courses'),
  deleteUser: (id) => apiClient.delete(`/users/${id}`)
};

export default adminService;
