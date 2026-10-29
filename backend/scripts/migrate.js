// Aplica en orden las migraciones de database/migrations que aún no se aplicaron.
// Uso: npm run migrate            (aplica las pendientes)
//      npm run migrate -- --status (solo muestra cuáles faltan)
// Cada archivo corre en una transacción y queda anotado en la tabla "migraciones".
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const here = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(here, '../../database/migrations');
const onlyStatus = process.argv.includes('--status');

if (!process.env.DATABASE_URL) {
  console.error('Falta DATABASE_URL');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'false' ? false : true,
});

// 001 es el esquema base (lo crea database/schema.sql en una instalación nueva); aquí van las incrementales
const files = fs
  .readdirSync(dir)
  .filter((f) => /^\d{3}_.+\.sql$/.test(f) && !f.startsWith('001'))
  .sort();

const client = await pool.connect();
try {
  await client.query(`CREATE TABLE IF NOT EXISTS migraciones (
    nombre TEXT PRIMARY KEY,
    aplicada_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  const done = new Set((await client.query('SELECT nombre FROM migraciones')).rows.map((r) => r.nombre));
  const pending = files.filter((f) => !done.has(f));

  if (pending.length === 0) {
    console.log('✅ No hay migraciones pendientes');
  } else if (onlyStatus) {
    console.log('Pendientes:', pending.join(', '));
  } else {
    for (const file of pending) {
      const sql = fs.readFileSync(path.join(dir, file), 'utf8');
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO migraciones (nombre) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`✅ ${file}`);
      } catch (error) {
        await client.query('ROLLBACK');
        console.error(`❌ ${file}: ${error.message}`);
        process.exitCode = 1;
        break;
      }
    }
  }
} finally {
  client.release();
  await pool.end();
}
