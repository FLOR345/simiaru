import { pool } from '../config/database.js';
import { AppError } from '../utils/errorHandler.js';
import {
  notifyLessonCompleted,
  notifyBadgeEarned
} from './notificationController.js';

/* ======================================================
   UTIL: VERIFICAR USUARIO EXISTENTE
====================================================== */
const ensureUserExists = async (userId) => {
  const result = await pool.query(
    'SELECT id FROM usuarios WHERE id = $1',
    [userId]
  );

  if (result.rowCount === 0) {
    throw new AppError('Usuario no existe o sesión inválida', 401);
  }
};

/* ======================================================
   INSIGNIAS
====================================================== */
const awardBadge = async (userId, badgeCode) => {
  try {
    const existing = await pool.query(
      `SELECT 1
       FROM usuarios_insignias ui
       JOIN insignias i ON ui.insignia_id = i.id
       WHERE ui.usuario_id = $1 AND i.codigo = $2`,
      [userId, badgeCode]
    );

    if (existing.rowCount > 0) return false;

    const badgeResult = await pool.query(
      'SELECT id, nombre FROM insignias WHERE codigo = $1',
      [badgeCode]
    );

    if (badgeResult.rowCount === 0) return false;

    const badge = badgeResult.rows[0];

    await pool.query(
      `INSERT INTO usuarios_insignias (usuario_id, insignia_id, fecha_obtencion)
       VALUES ($1, $2, NOW())`,
      [userId, badge.id]
    );

    console.log(`🏆 Insignia otorgada: ${badge.nombre} (usuario ${userId})`);
    return true;
  } catch (err) {
    console.error('Error otorgando insignia:', err);
    return false;
  }
};

const checkAndAwardBadges = async (userId, leccionId, porcentajeAciertos) => {
  const badgesAwarded = [];

  // 1️⃣ Primera lección
  const firstLesson = await pool.query(
    `SELECT COUNT(*) FROM progreso_usuario
     WHERE usuario_id = $1 AND completado = true`,
    [userId]
  );

  if (Number(firstLesson.rows[0].count) === 1) {
    if (await awardBadge(userId, 'complete_first_lesson')) {
      badgesAwarded.push('Primer Paso 🎯');
    }
  }

  // 2️⃣ Lección perfecta
  if (porcentajeAciertos === 100) {
    if (await awardBadge(userId, 'perfect_lesson')) {
      badgesAwarded.push('Perfeccionista ⭐');
    }
  }

  // 3️⃣ Unidad completada
  const unidadResult = await pool.query(
    `SELECT u.id, u.numero, u.nombre
     FROM lecciones l
     JOIN unidades u ON l.unidad_id = u.id
     WHERE l.id = $1`,
    [leccionId]
  );

  if (unidadResult.rowCount > 0) {
    const unidad = unidadResult.rows[0];

    const totalLessons = await pool.query(
      'SELECT COUNT(*) FROM lecciones WHERE unidad_id = $1',
      [unidad.id]
    );

    const completedLessons = await pool.query(
      `SELECT COUNT(*)
       FROM progreso_usuario pu
       JOIN lecciones l ON pu.leccion_id = l.id
       WHERE pu.usuario_id = $1
         AND l.unidad_id = $2
         AND pu.completado = true`,
      [userId, unidad.id]
    );

    if (
      Number(completedLessons.rows[0].count) >=
      Number(totalLessons.rows[0].count)
    ) {
      if (await awardBadge(userId, `complete_unit_${unidad.numero}`)) {
        badgesAwarded.push(`${unidad.nombre} completada 🎉`);
      }
    }
  }

  // 4️⃣ Todas las unidades
  const allUnits = await pool.query(
    `SELECT
      (SELECT COUNT(*) FROM unidades) AS total,
      (SELECT COUNT(DISTINCT l.unidad_id)
       FROM progreso_usuario pu
       JOIN lecciones l ON pu.leccion_id = l.id
       WHERE pu.usuario_id = $1 AND pu.completado = true) AS completed`,
    [userId]
  );

  if (
    Number(allUnits.rows[0].completed) >=
    Number(allUnits.rows[0].total)
  ) {
    if (await awardBadge(userId, 'complete_all_units')) {
      badgesAwarded.push('Sabio Andino 🏆');
    }
  }

  // 🔔 Notificaciones (no bloqueantes)
  for (const badge of badgesAwarded) {
    notifyBadgeEarned(userId, badge).catch(() => {});
  }

  return badgesAwarded;
};

export const checkStreakBadge = async (userId) => {
  const result = await pool.query(
    'SELECT racha_actual FROM usuarios WHERE id = $1',
    [userId]
  );

  if (result.rowCount > 0 && result.rows[0].racha_actual >= 7) {
    if (await awardBadge(userId, 'streak_7_days')) {
      notifyBadgeEarned(userId, 'Racha de Fuego 🔥').catch(() => {});
    }
  }
};

/* ======================================================
   GUARDAR PROGRESO (🔥 CLAVE)
====================================================== */
export const saveProgress = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return next(new AppError('Usuario no autenticado', 401));
    }

    const userId = req.user.id;
    const { leccionId, porcentajeAciertos } = req.body;

    if (!leccionId || porcentajeAciertos === undefined) {
      return next(new AppError('Datos incompletos', 400));
    }

    await ensureUserExists(userId);

    const completado = porcentajeAciertos >= 80;

    await pool.query(
      `INSERT INTO progreso_usuario
       (usuario_id, leccion_id, completado, porcentaje_aciertos, fecha_completado)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (usuario_id, leccion_id)
       DO UPDATE SET
         completado = EXCLUDED.completado,
         porcentaje_aciertos = EXCLUDED.porcentaje_aciertos,
         fecha_completado = NOW()`,
      [userId, leccionId, completado, porcentajeAciertos]
    );

    let puntos = 0;
    if (completado) {
      puntos = Math.floor(porcentajeAciertos);
      await pool.query(
        'UPDATE usuarios SET puntos_totales = puntos_totales + $1 WHERE id = $2',
        [puntos, userId]
      );
    }

    await pool.query(
      `UPDATE usuarios
       SET racha_actual = racha_actual + 1,
           ultima_actividad = NOW()
       WHERE id = $1`,
      [userId]
    );

    let insignias = [];
    if (completado) {
      insignias = await checkAndAwardBadges(
        userId,
        leccionId,
        porcentajeAciertos
      );
      await checkStreakBadge(userId);
    }

    if (porcentajeAciertos >= 60) {
      notifyLessonCompleted(userId, leccionId, porcentajeAciertos).catch(() => {});
    }

    res.json({
      success: true,
      message: 'Progreso guardado correctamente',
      puntos,
      insignias
    });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   OBTENER PROGRESO
====================================================== */
export const getProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT *
       FROM progreso_usuario
       WHERE usuario_id = $1
       ORDER BY fecha_completado DESC`,
      [userId]
    );

    res.json({ success: true, progress: result.rows });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   RACHA
====================================================== */
export const updateStreak = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT racha_actual FROM usuarios WHERE id = $1',
      [userId]
    );

    res.json({ success: true, streak: result.rows[0].racha_actual });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   INSIGNIAS
====================================================== */
export const getUserBadges = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT i.*, ui.fecha_obtencion
       FROM usuarios_insignias ui
       JOIN insignias i ON ui.insignia_id = i.id
       WHERE ui.usuario_id = $1
       ORDER BY ui.fecha_obtencion DESC`,
      [userId]
    );

    res.json({ success: true, badges: result.rows });
  } catch (error) {
    next(error);
  }
};

export const getAllBadges = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT
        i.*,
        CASE WHEN ui.id IS NOT NULL THEN true ELSE false END AS obtenida,
        ui.fecha_obtencion
       FROM insignias i
       LEFT JOIN usuarios_insignias ui
         ON i.id = ui.insignia_id AND ui.usuario_id = $1
       ORDER BY i.id`,
      [userId]
    );

    res.json({ success: true, badges: result.rows });
  } catch (error) {
    next(error);
  }
};
