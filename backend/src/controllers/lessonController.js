import { pool } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Obtiene todas las unidades de un idioma específico
 * @route GET /api/lessons/units?idioma=en
 */
export const getUnits = async (req, res, next) => {
  try {
    const { idioma } = req.query;

    // Validación de parámetros
    if (!idioma) {
      throw new AppError('El parámetro "idioma" es requerido', 400);
    }

    const validLanguages = ['quechua', 'aymara'];
    if (!validLanguages.includes(idioma.toLowerCase())) {
      throw new AppError(`Idioma no soportado: ${idioma}. Idiomas válidos: quechua, aymara`, 400);
    }

    const result = await pool.query(
      `SELECT 
        id, 
        numero,
        nombre, 
        descripcion, 
        idioma, 
        orden,
        icono_url
      FROM unidades 
      WHERE idioma = $1 
      ORDER BY orden ASC`,
      [idioma.toLowerCase()]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      units: result.rows
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene todas las lecciones de una unidad específica
 * @route GET /api/lessons/units/:unitId/lessons
 */
export const getLessonsByUnit = async (req, res, next) => {
  try {
    const { unitId } = req.params;
    const userId = req.user?.id;

    // Validación de parámetros
    if (!unitId || isNaN(parseInt(unitId))) {
      throw new AppError('ID de unidad inválido', 400);
    }

    // Verificar que la unidad existe
    const unitCheck = await pool.query(
      'SELECT id FROM unidades WHERE id = $1',
      [unitId]
    );

    if (unitCheck.rows.length === 0) {
      throw new AppError('Unidad no encontrada', 404);
    }

    let query;
    let params;

    if (userId) {
      query = `
        SELECT 
          l.id,
          l.numero,
          l.titulo,
          l.contenido_teorico,
          l.unidad_id,
          l.orden,
          COALESCE(p.completado, false) as completada,
          COALESCE(p.porcentaje_aciertos, 0) as puntuacion,
          p.fecha_completado
        FROM lecciones l
        LEFT JOIN progreso_usuario p ON l.id = p.leccion_id AND p.usuario_id = $2
        WHERE l.unidad_id = $1
        ORDER BY l.orden ASC
      `;
      params = [unitId, userId];
    } else {
      query = `
        SELECT 
          id,
          numero,
          titulo,
          contenido_teorico,
          unidad_id,
          orden
        FROM lecciones
        WHERE unidad_id = $1
        ORDER BY orden ASC
      `;
      params = [unitId];
    }

    const result = await pool.query(query, params);

    console.log(`Lecciones encontradas para unidad ${unitId}:`, result.rows.length);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      lessons: result.rows
    });

  } catch (error) {
    console.error('Error en getLessonsByUnit:', error);
    next(error);
  }
};

/**
 * Obtiene el contenido completo de una lección
 * @route GET /api/lessons/:lessonId
 */
export const getLessonContent = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user?.id;

    if (!lessonId || isNaN(parseInt(lessonId))) {
      throw new AppError('ID de lección inválido', 400);
    }

    // Obtener lección
    const lessonResult = await pool.query(
      `SELECT 
        l.id,
        l.numero,
        l.titulo,
        l.contenido_teorico,
        l.unidad_id,
        l.orden,
        u.nombre as unidad_nombre,
        u.idioma
      FROM lecciones l
      JOIN unidades u ON l.unidad_id = u.id
      WHERE l.id = $1`,
      [lessonId]
    );

    if (lessonResult.rows.length === 0) {
      throw new AppError('Lección no encontrada', 404);
    }

    // Obtener vocabulario
    const vocabResult = await pool.query(
      `SELECT 
        id,
        palabra_espanol,
        palabra_objetivo,
        audio_url,
        categoria,
        ejemplo_uso
      FROM vocabulario
      WHERE leccion_id = $1`,
      [lessonId]
    );

    // Obtener ejercicios
    const exercisesResult = await pool.query(
      `SELECT 
        id,
        tipo,
        pregunta,
        respuesta_correcta,
        opciones,
        audio_url
      FROM ejercicios
      WHERE leccion_id = $1`,
      [lessonId]
    );

    // Obtener progreso si hay usuario
    let progreso = null;
    if (userId) {
      const progresoResult = await pool.query(
        `SELECT completado, porcentaje_aciertos, fecha_completado
         FROM progreso_usuario
         WHERE usuario_id = $1 AND leccion_id = $2`,
        [userId, lessonId]
      );
      progreso = progresoResult.rows[0] || null;
    }

    const lesson = lessonResult.rows[0];

    res.status(200).json({
      success: true,
      lesson: {
        id: lesson.id,
        numero: lesson.numero,
        titulo: lesson.titulo,
        contenido_teorico: lesson.contenido_teorico,
        unidad_id: lesson.unidad_id,
        unidad_nombre: lesson.unidad_nombre,
        idioma: lesson.idioma,
        orden: lesson.orden,
        completada: progreso?.completado || false,
        puntuacion: progreso?.porcentaje_aciertos || 0
      },
      vocabulary: vocabResult.rows,
      exercises: exercisesResult.rows,
      stats: {
        total_vocabulary: vocabResult.rows.length,
        total_exercises: exercisesResult.rows.length
      }
    });

  } catch (error) {
    console.error('Error en getLessonContent:', error);
    next(error);
  }
};

/**
 * Obtiene estadísticas de una unidad
 * @route GET /api/lessons/units/:unitId/stats
 */
export const getUnitStats = async (req, res, next) => {
  try {
    const { unitId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Usuario no autenticado', 401);
    }

    if (!unitId || isNaN(parseInt(unitId))) {
      throw new AppError('ID de unidad inválido', 400);
    }

    const result = await pool.query(
      `SELECT 
        COUNT(l.id) as total_lessons,
        COUNT(CASE WHEN p.completada = true THEN 1 END) as completed_lessons,
        COALESCE(SUM(CASE WHEN p.completada = true THEN l.puntos_recompensa ELSE 0 END), 0) as total_points,
        COALESCE(AVG(CASE WHEN p.completada = true THEN p.puntuacion END), 0) as avg_score
      FROM lecciones l
      LEFT JOIN progreso_lecciones p ON l.id = p.leccion_id AND p.usuario_id = $2
      WHERE l.unidad_id = $1`,
      [unitId, userId]
    );

    const stats = result.rows[0];
    const progress = stats.total_lessons > 0 
      ? Math.round((stats.completed_lessons / stats.total_lessons) * 100)
      : 0;

    res.status(200).json({
      success: true,
      stats: {
        total_lessons: parseInt(stats.total_lessons),
        completed_lessons: parseInt(stats.completed_lessons),
        progress_percentage: progress,
        total_points: parseInt(stats.total_points),
        average_score: parseFloat(stats.avg_score).toFixed(1)
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Marca una lección como completada y registra progreso
 * @route POST /api/lessons/:lessonId/complete
 */
export const completeLesson = async (req, res, next) => {
  const client = await pool.connect();
  
  try {
    const { lessonId } = req.params;
    const { puntuacion, tiempo_completado, respuestas } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Usuario no autenticado', 401);
    }

    if (!lessonId || isNaN(parseInt(lessonId))) {
      throw new AppError('ID de lección inválido', 400);
    }

    if (puntuacion === undefined || puntuacion < 0 || puntuacion > 100) {
      throw new AppError('Puntuación inválida (debe estar entre 0 y 100)', 400);
    }

    await client.query('BEGIN');

    const lessonResult = await client.query(
      'SELECT puntos_recompensa FROM lecciones WHERE id = $1',
      [lessonId]
    );

    if (lessonResult.rows.length === 0) {
      throw new AppError('Lección no encontrada', 404);
    }

    const { puntos_recompensa } = lessonResult.rows[0];
    const puntosGanados = Math.round((puntuacion / 100) * puntos_recompensa);

    await client.query(
      `INSERT INTO progreso_lecciones 
        (usuario_id, leccion_id, completada, puntuacion, puntos_ganados, tiempo_completado, fecha_completado)
      VALUES ($1, $2, true, $3, $4, $5, NOW())
      ON CONFLICT (usuario_id, leccion_id) 
      DO UPDATE SET
        completada = true,
        puntuacion = GREATEST(progreso_lecciones.puntuacion, $3),
        puntos_ganados = GREATEST(progreso_lecciones.puntos_ganados, $4),
        tiempo_completado = $5,
        fecha_completado = NOW()
      RETURNING *`,
      [userId, lessonId, puntuacion, puntosGanados, tiempo_completado]
    );

    await client.query(
      `UPDATE usuarios 
       SET puntos_totales = puntos_totales + $1,
           fecha_ultima_actividad = NOW()
       WHERE id = $2`,
      [puntosGanados, userId]
    );

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: 'Lección completada exitosamente',
      data: {
        puntos_ganados: puntosGanados,
        puntuacion,
        lesson_completed: true
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};