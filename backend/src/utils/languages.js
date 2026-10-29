// Idiomas disponibles = los que tienen unidades en la base (cargados con scripts/import-language.js).
// Así una lengua nueva queda aceptada en todo el backend sin cambiar el código.
import { pool } from '../config/database.js';

let cache = { at: 0, ids: new Set(['quechua', 'aymara']) };

export const knownLanguages = async () => {
  if (Date.now() - cache.at < 5 * 60 * 1000) return cache.ids;
  const { rows } = await pool.query('SELECT DISTINCT idioma FROM unidades');
  cache = { at: Date.now(), ids: new Set(rows.map((r) => r.idioma)) };
  return cache.ids;
};

export const isKnownLanguage = async (id) => typeof id === 'string' && (await knownLanguages()).has(id);
