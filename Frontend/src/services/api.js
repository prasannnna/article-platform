import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Article APIs
export const articleAPI = {
  create: (formData) => {
    return api.post('/articles', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAll: (params = {}) => api.get('/articles', { params }),
  getById: (id) => api.get(`/articles/${id}`),
  update: (id, formData) => {
    return api.put(`/articles/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id) => api.delete(`/articles/${id}`),
  getMyArticles: () => api.get('/articles/my/articles'),
  getLeaderboard: (limit = 10) => api.get(`/articles/leaderboard?limit=${limit}`),
};

// Vote APIs 
export const voteAPI = {
  vote: (articleId) => api.post(`/votes/${articleId}`),
  checkVote: (articleId) => api.get(`/votes/check/${articleId}`),
};

export default api;