import apiClient from './apiClient';
import authService from './authService';
import courseService from './courseService';
import adminService from './adminService';

export const authApi = {
  login: (payload) => authService.login(payload),
  register: (payload) => authService.register(payload),
  me: () => authService.me()
};

export const courseApi = {
  list: (params = {}) => courseService.list(params),
  details: (id) => courseService.details(id),
  myCourses: () => courseService.myCourses(),
  create: (payload) => courseService.create(payload),
  remove: (id) => courseService.remove(id),
  
  // Teacher functions
  teacherCourses: () => courseService.teacherCourses(),
  teacherCreate: (payload) => courseService.teacherCreate(payload),
  teacherUpdate: (id, payload) => courseService.teacherUpdate(id, payload),
  teacherRemove: (id) => courseService.teacherRemove(id),
  teacherStudents: (courseId) => courseService.teacherStudents(courseId),
  teacherAnalytics: () => courseService.teacherAnalytics()
};

export const orderApi = {
  create: (payload) => apiClient.post('/orders', payload),
  markPaid: (id, payload) => apiClient.patch(`/orders/${id}/pay`, payload),
  listAll: () => apiClient.get('/orders')
};

export const userApi = {
  list: () => adminService.getUsers(),
  remove: (id) => adminService.deleteUser(id),
  
  // Category management
  categoriesRaw: () => adminService.getRawCategories(),
  categoryCreate: (payload) => adminService.categoryCreate(payload),
  categoryUpdate: (id, payload) => adminService.categoryUpdate(id, payload),
  categoryRemove: (id) => adminService.categoryRemove(id)
};
