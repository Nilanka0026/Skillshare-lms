import apiClient from './apiClient';
import authService from './authService';
import courseService from './courseService';
import adminService from './adminService';
import { enrollmentService } from './enrollmentService';

export const authApi = {
  login: (payload) => authService.login(payload),
  register: (payload) => authService.register(payload),
  me: () => authService.me(),
  updateProfile: (payload) => authService.updateProfile(payload),
  uploadImage: (file) => authService.uploadImage(file)
};

export const enrollmentApi = {
  checkStatus: (courseId) => enrollmentService.checkStatus(courseId),
  markLessonComplete: (courseId, lessonId) => enrollmentService.markLessonComplete(courseId, lessonId)
};

export const courseApi = {
  list: (params = {}) => courseService.list(params),
  details: (id) => courseService.details(id),
  myCourses: () => courseService.myCourses(),
  create: (payload) => courseService.create(payload),
  remove: (id) => courseService.remove(id),
  addLesson: (courseId, payload) => courseService.addLesson(courseId, payload),
  removeLesson: (courseId, lessonId) => courseService.removeLesson(courseId, lessonId),
  addQuiz: (courseId, payload) => courseService.addQuiz(courseId, payload),
  uploadVideo: (file) => courseService.uploadVideo(file),
  submitQuiz: (courseId, quizId, answers) => courseService.submitQuiz(courseId, quizId, answers),
  
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
  verifyInstructor: (id, status) => adminService.verifyInstructor(id, status),
  
  // Category management
  categoriesRaw: () => adminService.getRawCategories(),
  categoryCreate: (payload) => adminService.categoryCreate(payload),
  categoryUpdate: (id, payload) => adminService.categoryUpdate(id, payload),
  categoryRemove: (id) => adminService.categoryRemove(id)
};

export const chatbotApi = {
  getHistory: () => apiClient.get('/chatbot/history'),
  sendMessage: (message) => apiClient.post('/chatbot/message', { message }),
  clearHistory: () => apiClient.delete('/chatbot/history')
};

