// Genera un dataset de ejemplo SINTÉTICO con el mismo formato que la exportación real
// (database/samples/eventos_sinteticos.csv y .json). No contiene datos de ninguna persona:
// sirve para que otros investigadores vean el formato sin esperar a que haya datos reales.
// Uso: npm run dataset:ejemplo
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.env.DATABASE_URL ||= 'postgres://sin-conexion@localhost/sin-conexion'; // el módulo no se conecta para esto
const { EXPORT_COLUMNS, toCsv } = await import('../src/controllers/researchController.js');

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, '../../database/samples');

// Generador pseudoaleatorio con semilla (mulberry32): el dataset es siempre el mismo
let seed = 20261029;
const rand = () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const pick = (list) => list[Math.floor(rand() * list.length)];
const hex = (n) => Array.from({ length: n }, () => Math.floor(rand() * 16).toString(16)).join('');

const ITEMS = {
  quechua: [
    ['multiple_choice', "Allin p'unchay", 'Allin tuta'],
    ['translate', 'wasi', 'huasi'],
    ['translate', "p'unchay", 'punchay'],
    ['translate', 'qucha', 'qocha'],
    ['true_false', 'Verdadero', 'Falso'],
    ['word_order', "Allin p'unchay mamay", "mamay allin p'unchay"],
  ],
  aymara: [
    ['multiple_choice', 'Kamisaraki', 'Aski urukipana'],
    ['translate', 'jilata', 'hilata'],
    ['translate', "ch'uqi", 'chuqi'],
    ['translate', 'uta', 'uma'],
    ['true_false', 'Falso', 'Verdadero'],
  ],
};

const events = [];
let start = Date.parse('2026-11-03T13:00:00Z');
for (let p = 0; p < 24; p++) {
  const participante = hex(16);
  const idioma = p % 3 === 0 ? 'aymara' : 'quechua';
  const skill = 0.55 + rand() * 0.4; // probabilidad de acertar de cada participante
  const sessions = 2 + Math.floor(rand() * 4);
  for (let s = 0; s < sessions; s++) {
    const sesion = `${hex(8)}-${hex(4)}-${hex(4)}`;
    let t = start + p * 3600e3 + s * 86400e3 + Math.floor(rand() * 7200e3);
    const leccion_id = 1 + s * 2 + (idioma === 'aymara' ? 13 : 0);
    events.push({ participante, sesion, tipo: 'lesson_started', idioma, leccion_id, ocurrido_en: new Date(t).toISOString() });
    let correct = 0;
    const items = ITEMS[idioma];
    items.forEach(([tipo_ejercicio, esperado, distractor], i) => {
      t += 4000 + Math.floor(rand() * 20000);
      const r = rand();
      const writtenVariant = tipo_ejercicio === 'translate' && r < skill && rand() < 0.3;
      const resultado = r < skill ? (writtenVariant ? 'variante' : 'correcto') : 'incorrecto';
      if (resultado !== 'incorrecto') correct += 1;
      events.push({
        participante,
        sesion,
        tipo: 'exercise_answered',
        idioma,
        leccion_id,
        ejercicio_id: leccion_id * 10 + i,
        tipo_ejercicio,
        resultado,
        respuesta: resultado === 'correcto' ? esperado : resultado === 'variante' ? distractor : pick([distractor, `${esperado.slice(0, -1)}a`]),
        esperado,
        intento: 1,
        duracion_ms: 2500 + Math.floor(rand() * 15000),
        ocurrido_en: new Date(t).toISOString(),
      });
      if (rand() < 0.25) {
        events.push({ participante, sesion, tipo: 'audio_played', idioma, leccion_id, vocabulario_id: leccion_id * 100 + i, ocurrido_en: new Date(t + 900).toISOString() });
      }
    });
    t += 3000;
    events.push({
      participante,
      sesion,
      tipo: 'lesson_completed',
      idioma,
      leccion_id,
      duracion_ms: t - (start + p * 3600e3 + s * 86400e3),
      ocurrido_en: new Date(t).toISOString(),
      porcentaje: Math.round((correct / items.length) * 100),
    });
  }
}

const rows = events.map((e) => Object.fromEntries(EXPORT_COLUMNS.map((c) => [c, e[c] ?? null])));
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'eventos_sinteticos.csv'), `${toCsv(rows)}\n`);
fs.writeFileSync(
  path.join(outDir, 'eventos_sinteticos.json'),
  `${JSON.stringify({ formato: 'simiaru-eventos-v1', sintetico: true, aviso: 'Datos inventados por scripts/generate-sample-dataset.js; no corresponden a ninguna persona.', columnas: EXPORT_COLUMNS, total: rows.length, eventos: rows }, null, 2)}\n`
);
console.log(`✅ ${rows.length} eventos sintéticos de 24 participantes en database/samples/`);
process.exit(0);
