import axios from 'axios';

// Get API URL from environment variable
// In production (build), use the deployed backend URL
// In development, use the proxy (which defaults to localhost:8000)
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
