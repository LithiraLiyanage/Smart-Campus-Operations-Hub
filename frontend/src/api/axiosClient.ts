import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// We use relative path or env variable for base URL
const axiosClient = axios.create({
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT
axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Unauthorized
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear token and redirect to login if auth error
      if(window.location.pathname !== '/login') {
         useAuthStore.getState().logout();
         window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
