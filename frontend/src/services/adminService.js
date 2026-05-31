import apiClient from './apiClient';

export const adminService = {
  getUsers: () => apiClient.get('/admin/users'),
  getCourses: () => apiClient.get('/admin/courses'),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),

  // Categories CRUD
  getRawCategories: () => apiClient.get('/categories/raw'),
  createCategory: (payload) => apiClient.post('/categories', payload),
  updateCategory: (id, payload) => apiClient.put(`/categories/${id}`, payload),
  deleteCategory: (id) => apiClient.delete(`/categories/${id}`)
};

export default adminService;
