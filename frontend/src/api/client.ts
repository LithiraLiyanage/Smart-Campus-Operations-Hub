import axios from 'axios';

// Default base URL (assuming mock or backend at port 8080)
const API_BASE_URL = 'http://localhost:8083/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT if exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401/403
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // In a real app, you might want to redirect to login or show a generic error
      console.error('Unauthorized access or token expired');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
