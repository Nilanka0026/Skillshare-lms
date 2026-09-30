import apiClient from './apiClient';

export const authService = {
  login: (payload) => apiClient.post('/auth/login', payload),
  register: (payload) => apiClient.post('/auth/register', payload),
  me: () => apiClient.get('/auth/me'),
  updateProfile: (payload) => apiClient.put('/users/profile', payload),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};

export default authService;
