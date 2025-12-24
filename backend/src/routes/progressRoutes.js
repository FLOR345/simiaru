import express from 'express';
import { saveProgress, getProgress, updateStreak, getUserBadges, getAllBadges } from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas de progreso
router.post('/save', protect, saveProgress);
router.get('/', protect, getProgress);
router.get('/streak', protect, updateStreak);

// Rutas de insignias
router.get('/badges', protect, getUserBadges);      // Insignias del usuario
router.get('/badges/all', protect, getAllBadges);   // Todas las insignias con estado

export default router;