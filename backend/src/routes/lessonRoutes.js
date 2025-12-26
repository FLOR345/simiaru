import express from 'express';
import { getUnits, getLessonsByUnit, getLessonContent } from '../controllers/lessonController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas públicas (para modo invitado) - usan optionalProtect
router.get('/units', optionalProtect, getUnits);
router.get('/units/:unitId/lessons', optionalProtect, getLessonsByUnit);
router.get('/:lessonId', optionalProtect, getLessonContent);

export default router;