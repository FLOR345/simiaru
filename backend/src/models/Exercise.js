// exercise.js
import { pool } from "../config/database.js";

/*
    ========================================
                OBTENER EJERCICIOS
    ========================================
*/
export const getExercises = async (req, res) => {
  try {
    const { leccionId } = req.params;

    const result = await pool.query(
      `SELECT id, pregunta, opcion_1, opcion_2, opcion_3, correcta
         FROM ejercicios
        WHERE leccion_id = $1
        ORDER BY id ASC`,
      [leccionId]
    );

    res.json({
      success: true,
      exercises: result.rows
    });

  } catch (error) {
    console.error("Error en getExercises:", error);
    res.status(500).json({ message: error.message });
  }
};

/*
    ========================================
             GUARDAR RESULTADOS
    ========================================
*/
export const saveExerciseResult = async (req, res) => {
  try {
    const userId = req.user.id;
    const { leccionId, aciertos, total } = req.body;

    const porcentaje = Math.round((aciertos / total) * 100);
    const completado = porcentaje >= 80;

    // Registrar resultado
    await pool.query(
      `INSERT INTO resultados (usuario_id, leccion_id, aciertos, total, porcentaje, fecha)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (usuario_id, leccion_id)
       DO UPDATE SET aciertos = $3, total = $4, porcentaje = $5, fecha = NOW()`,
      [userId, leccionId, aciertos, total, porcentaje]
    );

    // Si completó → sumar puntos
    if (completado) {
      const puntos = porcentaje;
      await pool.query(
        `UPDATE usuarios SET puntos_totales = puntos_totales + $1 WHERE id = $2`,
        [puntos, userId]
      );
    }

    // Actualizar racha
    await pool.query(
      `UPDATE usuarios 
          SET racha_actual = racha_actual + 1, 
              ultima_actividad = NOW()
        WHERE id = $1`,
      [userId]
    );

    res.json({
      success: true,
      message: "Resultado guardado",
      porcentaje
    });

  } catch (error) {
    console.error("Error en saveExerciseResult:", error);
    res.status(500).json({ message: error.message });
  }
};

/*
    ========================================
             OBTENER PROGRESO
    ========================================
*/
export const getExerciseProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT r.*, l.titulo
         FROM resultados r
         JOIN lecciones l ON l.id = r.leccion_id
        WHERE usuario_id = $1
        ORDER BY fecha DESC`,
      [userId]
    );

    res.json({
      success: true,
      progress: result.rows
    });

  } catch (error) {
    console.error("Error en getExerciseProgress:", error);
    res.status(500).json({ message: error.message });
  }
};


/*
    ========================================
              CREAR EJERCICIO
    ========================================
*/
export const createExercise = async (req, res) => {
  try {
    const { leccionId, pregunta, opcion_1, opcion_2, opcion_3, correcta } = req.body;

    await pool.query(
      `INSERT INTO ejercicios (leccion_id, pregunta, opcion_1, opcion_2, opcion_3, correcta)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [leccionId, pregunta, opcion_1, opcion_2, opcion_3, correcta]
    );

    res.json({
      success: true,
      message: "Ejercicio creado"
    });

  } catch (error) {
    console.error("Error en createExercise:", error);
    res.status(500).json({ message: error.message });
  }
};


/*
    ========================================
              BORRAR EJERCICIO
    ========================================
*/
export const deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `DELETE FROM ejercicios WHERE id = $1`,
      [id]
    );

    res.json({
      success: true,
      message: "Ejercicio eliminado"
    });

  } catch (error) {
    console.error("Error en deleteExercise:", error);
    res.status(500).json({ message: error.message });
  }
};
