// backend/src/models/Unit.js
import pool from '../config/database.js';

class Unit {
  static async findAllByLanguage(language) {
    const query = `
      SELECT 
        id,
        nombre,
        descripcion,
        orden,
        idioma
      FROM units
      WHERE idioma = $1
      ORDER BY orden
    `;
    const result = await pool.query(query, [language]);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT * FROM units WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getLessonCount(unitId) {
    const query = `
      SELECT COUNT(*) as count 
      FROM lessons 
      WHERE unit_id = $1
    `;
    const result = await pool.query(query, [unitId]);
    return parseInt(result.rows[0].count);
  }

  static async create(unitData) {
    const { nombre, descripcion, orden, idioma } = unitData;
    const query = `
      INSERT INTO units (nombre, descripcion, orden, idioma)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [nombre, descripcion, orden, idioma]);
    return result.rows[0];
  }

  static async update(id, unitData) {
    const { nombre, descripcion, orden } = unitData;
    const query = `
      UPDATE units 
      SET nombre = $1, descripcion = $2, orden = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;
    const result = await pool.query(query, [nombre, descripcion, orden, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = `DELETE FROM units WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

export default Unit;