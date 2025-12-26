// frontend/src/services/api.js
import axios from 'axios';

// ==================== CONFIGURACIÓN BASE ====================
// 🔥 OPCIÓN 1: Si backend está en el MISMO dominio (Vercel monorepo)
const API_URL = import.meta.env.VITE_API_URL || 'https://simiaru-production-49cf.up.railway.app';

// 🔥 OPCIÓN 2: Si backend está en Railway, descomentar esta línea:
// const API_URL = import.meta.env.VITE_API_URL || 'https://simiaru-production-49cf.up.railway.app';

// 🔥 OPCIÓN 3: Para desarrollo local con backend separado:
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('🌐 API URL configurada:', API_URL || 'Rutas relativas (mismo dominio)');

// ==================== INSTANCIA DE AXIOS ====================
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ==================== INTERCEPTOR DE REQUEST ====================
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
  
  // 🔥 CORRECCIÓN: Eliminar "lessons" duplicado
  getLessonContent: (lessonId) => 
    axiosInstance.get(`/api/lessons/${lessonId}`),

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