// backend/src/controllers/notificationController.js
// Controlador para gestionar notificaciones

import { pool } from '../config/database.js';
import * as emailService from '../utils/emailService.js';

// ==================== ENVIAR EMAIL DE PRUEBA ====================
export const sendTestEmail = async (req, res) => {
  try {
    const usuario = {
      id: req.user.id,
      nombre: req.user.nombre,
      email: req.user.email,
      racha_actual: req.user.racha_actual || 5,
      puntos_totales: req.user.puntos_totales || 100
    };

    const success = await emailService.sendStreakReminder(usuario);

    if (success) {
      res.json({ 
        success: true, 
        message: `Email de prueba enviado a ${usuario.email}` 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Error al enviar email' 
      });
    }
  } catch (error) {
    console.error('Error en sendTestEmail:', error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== NOTIFICAR LECCIÓN COMPLETADA ====================
export const notifyLessonCompleted = async (usuarioId, leccionId, porcentaje) => {
  try {
    const userResult = await pool.query(
      'SELECT id, nombre, email, racha_actual, puntos_totales FROM usuarios WHERE id = $1',
      [usuarioId]
    );
    
    if (userResult.rows.length === 0) return false;
    
    const usuario = userResult.rows[0];

    const lessonResult = await pool.query(
      'SELECT id, titulo FROM lecciones WHERE id = $1',
      [leccionId]
    );
    
    if (lessonResult.rows.length === 0) return false;
    
    const leccion = lessonResult.rows[0];

    await emailService.sendLessonCompleted(usuario, leccion, porcentaje);
    
    return true;
  } catch (error) {
    console.error('Error en notifyLessonCompleted:', error);
    return false;
  }
};

// ==================== NOTIFICAR NUEVA INSIGNIA ====================
export const notifyBadgeEarned = async (usuarioId, insigniaId) => {
  try {
    const userResult = await pool.query(
      'SELECT id, nombre, email FROM usuarios WHERE id = $1',
      [usuarioId]
    );
    
    if (userResult.rows.length === 0) return false;
    
    const usuario = userResult.rows[0];

    const badgeResult = await pool.query(
      'SELECT id, nombre, descripcion FROM insignias WHERE id = $1',
      [insigniaId]
    );
    
    if (badgeResult.rows.length === 0) return false;
    
    const insignia = badgeResult.rows[0];

    await emailService.sendBadgeEarned(usuario, insignia);
    
    return true;
  } catch (error) {
    console.error('Error en notifyBadgeEarned:', error);
    return false;
  }
};

// ==================== OBTENER CONFIGURACIÓN ====================
export const getNotificationSettings = async (req, res) => {
  try {
    res.json({
      email_recordatorio_racha: true,
      email_leccion_completada: true,
      email_insignia_nueva: true,
      email_semanal: false
    });
  } catch (error) {
    console.error('Error en getNotificationSettings:', error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== ACTUALIZAR CONFIGURACIÓN ====================
export const updateNotificationSettings = async (req, res) => {
  try {
    const { 
      email_recordatorio_racha, 
      email_leccion_completada, 
      email_insignia_nueva,
      email_semanal 
    } = req.body;

    res.json({
      success: true,
      message: 'Configuración actualizada',
      settings: {
        email_recordatorio_racha,
        email_leccion_completada,
        email_insignia_nueva,
        email_semanal
      }
    });
  } catch (error) {
    console.error('Error en updateNotificationSettings:', error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== ENVIAR RECORDATORIO MANUAL ====================
export const sendManualReminder = async (req, res) => {
  try {
    const { userId } = req.params;

    const userResult = await pool.query(
      'SELECT id, nombre, email, racha_actual FROM usuarios WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuario = userResult.rows[0];
    const success = await emailService.sendStreakReminder(usuario);

    if (success) {
      res.json({ 
        success: true, 
        message: `Recordatorio enviado a ${usuario.email}` 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Error al enviar recordatorio' 
      });
    }
  } catch (error) {
    console.error('Error en sendManualReminder:', error);
    res.status(500).json({ error: error.message });
  }
};