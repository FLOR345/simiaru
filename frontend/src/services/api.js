// frontend/src/services/api.js
import axios from 'axios';

// ==================== CONFIGURACIÓN BASE ====================
// Obtener la URL del backend desde variables de entorno
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('🌐 API URL configurada:', API_URL);

// ==================== INSTANCIA DE AXIOS ====================
// Crear una instancia de axios con configuración por defecto
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ==================== INTERCEPTOR DE REQUEST ====================
// Agregar el token automáticamente a todas las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Error en request:', error);
    return Promise.reject(error);
  }
);

// ==================== INTERCEPTOR DE RESPONSE ====================
// Manejar respuestas y errores globalmente
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url} - OK`);
    return response;
  },
  (error) => {
    console.error('❌ Error en response:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

    // Si el token expiró o es inválido, redirigir al login
    if (error.response?.status === 401) {
      console.warn('🔐 Token inválido o expirado');
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// ==================== API ENDPOINTS ====================
export const api = {
  // ===== AUTH =====
  login: (credentials) => 
    axiosInstance.post('/api/auth/login', credentials),
  
  register: (data) => 
    axiosInstance.post('/api/auth/register', data),
  
  getProfile: () => 
    axiosInstance.get('/api/auth/profile'),
  
  updateProfile: (data) => 
    axiosInstance.put('/api/auth/profile', data),
  
  changePassword: (data) => 
    axiosInstance.put('/api/auth/change-password', data),
  
  hasPassword: () => 
    axiosInstance.get('/api/auth/has-password'),

  // ===== LESSONS =====
  getUnits: (idioma) => 
    axiosInstance.get(`/api/lessons/units?idioma=${idioma}`),
  
  getLessonsByUnit: (unitId) => 
    axiosInstance.get(`/api/lessons/units/${unitId}/lessons`),
  
  getLessonContent: (lessonId) => 
    axiosInstance.get(`/api/lessons/lessons/${lessonId}`),

  // ===== PROGRESS =====
  saveProgress: (data) => 
    axiosInstance.post('/api/progress/save', data),
  
  getProgress: () => 
    axiosInstance.get('/api/progress'),
  
  updateStreak: () => 
    axiosInstance.post('/api/progress/streak'),
  
  getUserBadges: () => 
    axiosInstance.get('/api/progress/badges'),
  
  getAllBadges: () => 
    axiosInstance.get('/api/progress/badges/all'),

  // ===== DICTIONARY =====
  searchWord: (query, idioma) => 
    axiosInstance.get(`/api/dictionary/search?query=${query}&idioma=${idioma}`),
  
  getCategories: (idioma) => 
    axiosInstance.get(`/api/dictionary/categories?idioma=${idioma}`),

  // ===== CULTURE =====
  getCulturalContent: (tipo, idioma) => 
    axiosInstance.get(`/api/culture?tipo=${tipo}&idioma=${idioma}`)
};

// ==================== EXPORT DEFAULT ====================
export default axiosInstance;