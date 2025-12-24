// culture.js
import { pool } from "../config/database.js";

/*
    ========================================
           OBTENER LECCIONES CULTURALES
    ========================================
*/
export const getCulturalLessons = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, titulo, descripcion, idioma, contenido, imagen_url 
       FROM cultura 
       ORDER BY id ASC`
    );

    res.json({
      success: true,
      lessons: result.rows
    });

  } catch (error) {
    console.error("Error en getCulturalLessons:", error);
    res.status(500).json({ message: error.message });
  }
};


/*
    ========================================
            OBTENER UNA LECCIÓN
    ========================================
*/
export const getCulturalLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM cultura WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Lección no encontrada" });

    res.json({
      success: true,
      lesson: result.rows[0]
    });

  } catch (error) {
    console.error("Error en getCulturalLesson:", error);
    res.status(500).json({ message: error.message });
  }
};


/*
    ========================================
            AGREGAR LECCIÓN CULTURAL
    ========================================
*/
export const addCulturalLesson = async (req, res) => {
  try {
    const { titulo, descripcion, idioma, contenido, imagen_url } = req.body;

    await pool.query(
      `INSERT INTO cultura (titulo, descripcion, idioma, contenido, imagen_url)
       VALUES ($1, $2, $3, $4, $5)`,
      [titulo, descripcion, idioma, contenido, imagen_url]
    );

    res.json({
      success: true,
      message: "Lección cultural agregada correctamente"
    });

  } catch (error) {
    console.error("Error en addCulturalLesson:", error);
    res.status(500).json({ message: error.message });
  }
};


/*
    ========================================
         GUARDAR PROGRESO CULTURAL
    ========================================
*/
export const saveCulturalProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lessonId } = req.body;

    await pool.query(
      `INSERT INTO cultura_progreso (usuario_id, leccion_id, fecha)
       VALUES ($1, $2, NOW())
       ON CONFLICT (usuario_id, leccion_id)
       DO UPDATE SET fecha = NOW()`,
      [userId, lessonId]
    );

    res.json({
      success: true,
      message: "Progreso cultural guardado"
    });

  } catch (error) {
    console.error("Error en saveCulturalProgress:", error);
    res.status(500).json({ message: error.message });
  }
};


/*
    ========================================
          OBTENER PROGRESO CULTURAL
    ========================================
*/
export const getCulturalProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT c.titulo, cp.fecha 
         FROM cultura_progreso cp
         JOIN cultura c ON c.id = cp.leccion_id
        WHERE usuario_id = $1`,
      [userId]
    );

    res.json({
      success: true,
      progress: result.rows
    });

  } catch (error) {
    console.error("Error en getCulturalProgress:", error);
    res.status(500).json({ message: error.message });
  }
};
