// frontend/src/services/api.js
import axios from 'axios';

const API_BASE = '/api';

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
  getCulturalContent: (tipo, idioma) => 
    axios.get(`${API_BASE}/culture?tipo=${tipo}&idioma=${idioma}`)
};

export default axios.create({
  baseURL: 'http://localhost:5000'
});