// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor to add token to requests
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('gimmyToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// You can add specific service functions here, e.g., for exercises
export const getExercises = () => apiClient.get('/exercises');
export const getExerciseById = (id) => apiClient.get(`/exercises/${id}`);
// ... other service functions

export default apiClient;
// Default export can be the configured axios instance.
// Named exports for specific functions.
