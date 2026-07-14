import apiClient from './apiClient';

export const adminService = {
  getUsers: () => apiClient.get('/admin/users'),
  getCourses: () => apiClient.get('/admin/courses'),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
  verifyInstructor: (id, status) => apiClient.put(`/admin/users/${id}/verify`, { status }),

  // Categories CRUD
  getRawCategories: () => apiClient.get('/categories/raw'),
  createCategory: (payload) => apiClient.post('/categories', payload),
  updateCategory: (id, payload) => apiClient.put(`/categories/${id}`, payload),
  deleteCategory: (id) => apiClient.delete(`/categories/${id}`),

  // Aliases to match api.js mappings
  categoryCreate: (payload) => apiClient.post('/categories', payload),
  categoryUpdate: (id, payload) => apiClient.put(`/categories/${id}`, payload),
  categoryRemove: (id) => apiClient.delete(`/categories/${id}`)
};

export default adminService;
