import { pool } from '../config/database.js';
import { notifyLessonCompleted } from './notificationController.js';
import { applyLessonResult } from '../utils/gamification.js';

// ==================== GUARDAR PROGRESO ====================
// Guarda el mejor resultado de la lección y delega puntos, racha, nivel e insignias en utils/gamification.js
export const saveProgress = async (req, res, next) => {
  try {
    const leccionId = Number(req.body.leccionId);
    const porcentaje = Math.round(Number(req.body.porcentajeAciertos));
    const userId = req.user.id;
    const completado = porcentaje >= 80;

    const exists = await pool.query('SELECT 1 FROM lecciones WHERE id = $1', [leccionId]);
    if (exists.rows.length === 0) return res.status(404).json({ message: 'La lección no existe' });

    // Se conserva el mejor porcentaje y, una vez aprobada, la lección sigue completada
    await pool.query(
      `INSERT INTO progreso_usuario (usuario_id, leccion_id, completado, porcentaje_aciertos, fecha_completado)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (usuario_id, leccion_id)
       DO UPDATE SET porcentaje_aciertos = GREATEST(progreso_usuario.porcentaje_aciertos, EXCLUDED.porcentaje_aciertos),
                     completado = progreso_usuario.completado OR EXCLUDED.completado,
                     fecha_completado = NOW()`,
      [userId, leccionId, completado, porcentaje]
    );

    const result = await applyLessonResult({ userId, leccionId, porcentaje, completado });

    // El resultado se envía por correo; se espera hasta 5 s para poder decirle a la persona si llegó
    let correo = null;
    if (porcentaje >= 60) {
      const envio = notifyLessonCompleted(userId, leccionId, porcentaje).catch((err) => ({ enviado: false, motivo: err.message }));
      correo = await Promise.race([envio, new Promise((r) => setTimeout(() => r({ enviado: null }), 5000))]);
      if (correo === false) correo = null;
    }

    res.json({ success: true, message: 'Progreso guardado', ...result, correo });
  } catch (error) {
    next(error);
  }
};

// ==================== OBTENER PROGRESO ====================
export const getProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Incluye el título de la lección para mostrar el historial con nombres
    const result = await pool.query(
      `SELECT p.*, l.titulo AS leccion_titulo, u.idioma
       FROM progreso_usuario p
       LEFT JOIN lecciones l ON l.id = p.leccion_id
       LEFT JOIN unidades u ON u.id = l.unidad_id
       WHERE p.usuario_id = $1
       ORDER BY p.fecha_completado DESC NULLS LAST`,
      [userId]
    );

    res.json({ success: true, progress: result.rows });
  } catch (error) {
    console.error('Error en getProgress:', error);
    res.status(500).json({ message: error.message });
  }
};

// ==================== OBTENER RACHA ====================
export const updateStreak = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      'SELECT racha_actual FROM usuarios WHERE id = $1',
      [userId]
    );
    
    res.json({ success: true, streak: result.rows[0].racha_actual });
  } catch (error) {
    console.error('Error en updateStreak:', error);
    res.status(500).json({ message: error.message });
  }
};

// ==================== OBTENER INSIGNIAS DEL USUARIO ====================
export const getUserBadges = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      `SELECT i.id, i.nombre, i.descripcion, i.icono, i.codigo, ui.fecha_obtencion
       FROM usuarios_insignias ui
       JOIN insignias i ON ui.insignia_id = i.id
       WHERE ui.usuario_id = $1
       ORDER BY ui.fecha_obtencion DESC`,
      [userId]
    );
    
    res.json({ 
      success: true, 
      badges: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Error en getUserBadges:', error);
    res.status(500).json({ message: error.message });
  }
};

// ==================== OBTENER TODAS LAS INSIGNIAS ====================
export const getAllBadges = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obtener todas las insignias con estado de si el usuario las tiene
    const result = await pool.query(
      `SELECT 
        i.id, 
        i.nombre, 
        i.descripcion, 
        i.icono, 
        i.codigo,
        CASE WHEN ui.id IS NOT NULL THEN true ELSE false END as obtenida,
        ui.fecha_obtencion
       FROM insignias i
       LEFT JOIN usuarios_insignias ui ON i.id = ui.insignia_id AND ui.usuario_id = $1
       ORDER BY i.id`,
      [userId]
    );
    
    const obtained = result.rows.filter(b => b.obtenida).length;
    
    res.json({ 
      success: true, 
      badges: result.rows,
      stats: {
        total: result.rows.length,
        obtained: obtained,
        pending: result.rows.length - obtained
      }
    });
  } catch (error) {
    console.error('Error en getAllBadges:', error);
    res.status(500).json({ message: error.message });
  }
};