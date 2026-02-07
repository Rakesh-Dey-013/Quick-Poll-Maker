import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const pollAPI = {
  getAll: (params) => api.get('/polls', { params }),
  getOne: (id) => api.get(`/polls/${id}`),
  create: (data) => api.post('/polls', data),
  delete: (id) => api.delete(`/polls/${id}`),
  vote: (id, selectedOptionIndex) => 
    api.post(`/votes/${id}/vote`, { selectedOptionIndex }),
  getMyPolls: () => api.get('/polls/me/created'),
  getMyVotes: () => api.get('/polls/me/voted'),
};

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => 
    api.post('/auth/register', { name, email, password }),
  getMe: () => api.get('/auth/me'),
  logout: () => api.get('/auth/logout'),
};

export default api;