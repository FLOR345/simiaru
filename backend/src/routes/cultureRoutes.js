import express from 'express';
import {
  getCulturalContent,
  getContentById,
  getRandomContent,
  searchCulturalContent,
  getContentTypes,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  createCulturalContent,
  bulkImportContent,
  updateCulturalContent,
  deleteCulturalContent,
  getCulturalStats,
  getPopularContent
} from '../controllers/cultureController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ==========================================
// RUTAS PÚBLICAS
// ==========================================

// Obtener contenido cultural con filtros
router.get('/', getCulturalContent);

// Buscar contenido
router.get('/search', searchCulturalContent);

// Contenido aleatorio del día
router.get('/random', getRandomContent);

// Obtener por ID
router.get('/:id', getContentById);

// Tipos de contenido disponibles
router.get('/info/types', getContentTypes);

// Estadísticas
router.get('/info/stats', getCulturalStats);

// Contenido más popular
router.get('/info/popular', getPopularContent);

// ==========================================
// RUTAS PROTEGIDAS (USUARIO AUTENTICADO)
// ==========================================

// Favoritos
router.post('/favorites/:contentId', protect, addToFavorites);
router.delete('/favorites/:contentId', protect, removeFromFavorites);
router.get('/favorites/list', protect, getFavorites);

// ==========================================
// RUTAS ADMIN (SOLO ADMINISTRADORES)
// ==========================================

// CRUD de contenido cultural
router.post('/admin/content', protect, isAdmin, createCulturalContent);
router.post('/admin/bulk', protect, isAdmin, bulkImportContent);
router.put('/admin/content/:id', protect, isAdmin, updateCulturalContent);
router.delete('/admin/content/:id', protect, isAdmin, deleteCulturalContent);

export default router;