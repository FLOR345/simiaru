// badge.js
import { pool } from "../config/database.js";

/*
  =============================
     REGLAS DE INSIGNIAS
  =============================
*/
const badgesRules = [
  { id: 1, name: "Primer paso", condition: (stats) => stats.leccionesCompletadas >= 1 },
  { id: 2, name: "Aprendiz constante", condition: (stats) => stats.leccionesCompletadas >= 5 },
  { id: 3, name: "Leyenda del aprendizaje", condition: (stats) => stats.leccionesCompletadas >= 10 },

  { id: 4, name: "100 puntos", condition: (stats) => stats.puntos >= 100 },
  { id: 5, name: "300 puntos", condition: (stats) => stats.puntos >= 300 },
  { id: 6, name: "500 puntos", condition: (stats) => stats.puntos >= 500 },

  { id: 7, name: "Racha 3 días", condition: (stats) => stats.racha >= 3 },
  { id: 8, name: "Racha 7 días", condition: (stats) => stats.racha >= 7 }
];

/*
  =========================================
      ASIGNAR INSIGNIAS AUTOMÁTICAMENTE
  =========================================
*/
export const checkBadges = async (req, res) => {
  try {
    const userId = req.user.id;

    // Obtener estadísticas del usuario
    const statsQuery = await pool.query(
      `SELECT 
          puntos_totales,
          racha_actual,
          (
            SELECT COUNT(*) 
            FROM progreso_usuario 
            WHERE usuario_id = $1 AND completado = TRUE
          ) AS lecciones_completadas
        FROM usuarios WHERE id = $1`,
      [userId]
    );

    const stats = {
      puntos: statsQuery.rows[0].puntos_totales,
      racha: statsQuery.rows[0].racha_actual,
      leccionesCompletadas: statsQuery.rows[0].lecciones_completadas
    };

    // Obtener insignias YA ganadas
    const existingBadgesQuery = await pool.query(
      "SELECT badge_id FROM badges_usuario WHERE usuario_id = $1",
      [userId]
    );
    const existingBadges = existingBadgesQuery.rows.map(b => b.badge_id);

    let newBadges = [];

    // Evaluar reglas
    for (const rule of badgesRules) {
      if (rule.condition(stats) && !existingBadges.includes(rule.id)) {
        newBadges.push(rule.id);

        // Guardar en BD
        await pool.query(
          `INSERT INTO badges_usuario (usuario_id, badge_id, fecha_ganado) 
           VALUES ($1, $2, NOW())`,
          [userId, rule.id]
        );
      }
    }

    res.json({
      success: true,
      newBadges
    });

  } catch (error) {
    console.error("Error en checkBadges:", error);
    res.status(500).json({ message: error.message });
  }
};


/*
  =============================
      OBTENER INSIGNIAS
  =============================
*/
export const getBadges = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT b.id, b.nombre, bu.fecha_ganado
       FROM badges b
       JOIN badges_usuario bu ON bu.badge_id = b.id
       WHERE bu.usuario_id = $1`,
      [userId]
    );

    res.json({
      success: true,
      badges: result.rows
    });

  } catch (error) {
    console.error("Error en getBadges:", error);
    res.status(500).json({ message: error.message });
  }
};
