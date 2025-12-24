// backend/src/routes/notificationRoutes.js
// Rutas para gestionar notificaciones

import express from 'express';
import passport from 'passport';
import * as notificationController from '../controllers/notificationController.js';

const router = express.Router();

// Middleware de autenticación
const auth = passport.authenticate('jwt', { session: false });

// ==================== RUTAS ====================

// GET /api/notifications/settings - Obtener configuración
router.get('/settings', auth, notificationController.getNotificationSettings);

// PUT /api/notifications/settings - Actualizar configuración
router.put('/settings', auth, notificationController.updateNotificationSettings);

// POST /api/notifications/test - Enviar email de prueba
router.post('/test', auth, notificationController.sendTestEmail);

// POST /api/notifications/reminder/:userId - Enviar recordatorio manual
router.post('/reminder/:userId', auth, notificationController.sendManualReminder);

export default router;