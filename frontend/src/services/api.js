// frontend/src/services/api.js
import axios from 'axios';

// En producción usa la variable de entorno, en desarrollo usa el proxy
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

export const api = {
  // Auth
  login: (credentials) => axios.post(`${API_BASE}/auth/login`, credentials),
  register: (data) => axios.post(`${API_BASE}/auth/register`, data),
  getProfile: () => axios.get(`${API_BASE}/auth/profile`),

  // Lessons
  getUnits: (idioma) => axios.get(`${API_BASE}/lessons/units?idioma=${idioma}`),
  getLessonsByUnit: (unitId) => axios.get(`${API_BASE}/lessons/units/${unitId}/lessons`),
  getLessonContent: (lessonId) => axios.get(`${API_BASE}/lessons/lessons/${lessonId}`),

  // Progress
  saveProgress: (data) => axios.post(`${API_BASE}/progress/save`, data),
  getProgress: () => axios.get(`${API_BASE}/progress`),
  updateStreak: () => axios.post(`${API_BASE}/progress/streak`),

  // Dictionary
  searchWord: (query, idioma) => axios.get(`${API_BASE}/dictionary/search?query=${query}&idioma=${idioma}`),
  getCategories: (idioma) => axios.get(`${API_BASE}/dictionary/categories?idioma=${idioma}`),

  // Culture
  getCulturalContent: (tipo, idioma) => axios.get(`${API_BASE}/culture?tipo=${tipo}&idioma=${idioma}`)
};

// Instancia de axios con baseURL dinámica
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

export default axiosInstance;