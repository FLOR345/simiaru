import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// La cadena de conexión se lee del archivo .env (nunca escribirla aquí)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Falta DATABASE_URL en el archivo .env. Revisa backend/.env.example');
  process.exit(1);
}

console.log('🔗 Conectando a la base de datos...');

export const pool = new Pool({
  connectionString: connectionString,
  // Neon exige SSL; en Docker/local (DATABASE_SSL=false) se conecta sin SSL
  ssl: process.env.DATABASE_SSL === 'false' ? false : true,
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
});

// Lanza el error para que server.js detenga el arranque si la base no responde (fail-fast)
export const connectDB = async () => {
  const result = await pool.query('SELECT NOW()');
  console.log('✅ Database connected');
  console.log('📅 Server time:', result.rows[0].now);
};
