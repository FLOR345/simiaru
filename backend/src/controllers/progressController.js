import { pool } from '../config/database.js';
import { notifyLessonCompleted, notifyBadgeEarned } from './notificationController.js';

// ==================== FUNCIÓN PARA OTORGAR INSIGNIAS ====================
const checkAndAwardBadges = async (userId, leccionId, porcentajeAciertos) => {
  try {
    const badgesAwarded = [];

    // 1. PRIMER PASO - Primera lección completada
    const firstLessonCheck = await pool.query(
      `SELECT COUNT(*) as total FROM progreso_usuario 
       WHERE usuario_id = $1 AND completado = true`,
      [userId]
    );
    
    if (parseInt(firstLessonCheck.rows[0].total) === 1) {
      const awarded = await awardBadge(userId, 'complete_first_lesson');
      if (awarded) badgesAwarded.push('Primer Paso 🎯');
    }

    // 2. PERFECCIONISTA - 100% en una lección
    if (porcentajeAciertos === 100) {
      const awarded = await awardBadge(userId, 'perfect_lesson');
      if (awarded) badgesAwarded.push('Perfeccionista ⭐');
    }

    // 3. VERIFICAR UNIDADES COMPLETADAS
    const unidadResult = await pool.query(
      `SELECT u.id, u.numero, u.nombre 
       FROM lecciones l 
       JOIN unidades u ON l.unidad_id = u.id 
       WHERE l.id = $1`,
      [leccionId]
    );

    if (unidadResult.rows.length > 0) {
      const unidad = unidadResult.rows[0];
      
      // Contar lecciones de la unidad
      const totalLessons = await pool.query(
        `SELECT COUNT(*) as total FROM lecciones WHERE unidad_id = $1`,
        [unidad.id]
      );

      // Contar lecciones completadas de la unidad
      const completedLessons = await pool.query(
        `SELECT COUNT(*) as completed 
         FROM progreso_usuario pu
         JOIN lecciones l ON pu.leccion_id = l.id
         WHERE pu.usuario_id = $1 AND l.unidad_id = $2 AND pu.completado = true`,
        [userId, unidad.id]
      );

      const total = parseInt(totalLessons.rows[0].total);
      const completed = parseInt(completedLessons.rows[0].completed);

      // Si completó toda la unidad
      if (total > 0 && completed >= total) {
        const unitBadgeCode = `complete_unit_${unidad.numero}`;
        const awarded = await awardBadge(userId, unitBadgeCode);
        if (awarded) badgesAwarded.push(`${unidad.nombre} completada 🎉`);
      }
    }

    // 4. SABIO ANDINO - Todas las unidades completadas
    const allUnitsCheck = await pool.query(
      `SELECT 
        (SELECT COUNT(DISTINCT id) FROM unidades) as total_units,
        (SELECT COUNT(DISTINCT l.unidad_id) 
         FROM progreso_usuario pu
         JOIN lecciones l ON pu.leccion_id = l.id
         WHERE pu.usuario_id = $1 AND pu.completado = true
        ) as completed_units`,
      [userId]
    );

    const totalUnits = parseInt(allUnitsCheck.rows[0].total_units);
    const completedUnits = parseInt(allUnitsCheck.rows[0].completed_units);

    if (totalUnits > 0 && completedUnits >= totalUnits) {
      const awarded = await awardBadge(userId, 'complete_all_units');
      if (awarded) badgesAwarded.push('Sabio Andino 🏆');
    }

    // Notificar insignias ganadas por email
    for (const badge of badgesAwarded) {
      notifyBadgeEarned(userId, badge).catch(err => 
        console.log('Error notificando insignia:', err.message)
      );
    }

    return badgesAwarded;

  } catch (error) {
    console.error('Error verificando insignias:', error);
    return [];
  }
};

// Función para otorgar una insignia específica
const awardBadge = async (userId, badgeCode) => {
  try {
    // Verificar si ya tiene la insignia
    const existingBadge = await pool.query(
      `SELECT ui.id FROM usuarios_insignias ui
       JOIN insignias i ON ui.insignia_id = i.id
       WHERE ui.usuario_id = $1 AND i.codigo = $2`,
      [userId, badgeCode]
    );

    if (existingBadge.rows.length > 0) {
      return false; // Ya tiene la insignia
    }

    // Obtener ID de la insignia
    const badgeResult = await pool.query(
      `SELECT id, nombre FROM insignias WHERE codigo = $1`,
      [badgeCode]
    );

    if (badgeResult.rows.length === 0) {
      console.log(`Insignia no encontrada: ${badgeCode}`);
      return false;
    }

    const badge = badgeResult.rows[0];

    // Otorgar la insignia
    await pool.query(
      `INSERT INTO usuarios_insignias (usuario_id, insignia_id, fecha_obtencion)
       VALUES ($1, $2, NOW())`,
      [userId, badge.id]
    );

    console.log(`🏆 Insignia otorgada: ${badge.nombre} al usuario ${userId}`);
    return true;

  } catch (error) {
    console.error('Error otorgando insignia:', error);
    return false;
  }
};

// Verificar insignia de racha
export const checkStreakBadge = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT racha_actual FROM usuarios WHERE id = $1`,
      [userId]
    );

    if (result.rows.length > 0) {
      const racha = result.rows[0].racha_actual;
      
      // Racha de 7 días
      if (racha >= 7) {
        const awarded = await awardBadge(userId, 'streak_7_days');
        if (awarded) {
          console.log(`🔥 Insignia de racha otorgada al usuario ${userId}`);
          notifyBadgeEarned(userId, 'Racha de Fuego 🔥').catch(err => 
            console.log('Error notificando insignia:', err.message)
          );
        }
      }
    }
  } catch (error) {
    console.error('Error verificando racha:', error);
  }
};

// ==================== GUARDAR PROGRESO ====================
export const saveProgress = async (req, res) => {
  try {
    const { leccionId, porcentajeAciertos } = req.body;
    const userId = req.user.id;
    const completado = porcentajeAciertos >= 80;

    console.log('Guardando progreso:', { userId, leccionId, porcentajeAciertos, completado });

    // Guardar progreso
    await pool.query(
      `INSERT INTO progreso_usuario (usuario_id, leccion_id, completado, porcentaje_aciertos, fecha_completado)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (usuario_id, leccion_id) 
       DO UPDATE SET porcentaje_aciertos = $4, completado = $3, fecha_completado = NOW()`,
      [userId, leccionId, completado, porcentajeAciertos]
    );

    // Actualizar puntos si completó
    let puntosGanados = 0;
    if (completado) {
      puntosGanados = Math.floor(porcentajeAciertos);
      await pool.query(
        'UPDATE usuarios SET puntos_totales = puntos_totales + $1 WHERE id = $2',
        [puntosGanados, userId]
      );
      console.log(`Agregados ${puntosGanados} puntos al usuario ${userId}`);
    }

    // Actualizar racha
    await pool.query(
      'UPDATE usuarios SET racha_actual = racha_actual + 1, ultima_actividad = NOW() WHERE id = $1',
      [userId]
    );

    // 🏆 VERIFICAR Y OTORGAR INSIGNIAS
    let badgesAwarded = [];
    if (completado) {
      badgesAwarded = await checkAndAwardBadges(userId, leccionId, porcentajeAciertos);
      await checkStreakBadge(userId);
    }

    // 🔔 Notificar por email si aprobó (no bloqueante)
    if (porcentajeAciertos >= 60) {
      notifyLessonCompleted(userId, leccionId, porcentajeAciertos)
        .catch(err => console.log('Error enviando notificación:', err.message));
    }

    res.json({ 
      success: true, 
      message: 'Progreso guardado exitosamente',
      puntos: puntosGanados,
      insignias: badgesAwarded
    });

  } catch (error) {
    console.error('Error en saveProgress:', error);
    res.status(500).json({ message: error.message });
  }
};

// ==================== OBTENER PROGRESO ====================
export const getProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      'SELECT * FROM progreso_usuario WHERE usuario_id = $1 ORDER BY fecha_completado DESC',
      [userId]
    );
    
    console.log(`Progreso encontrado: ${result.rows.length} lecciones`);
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