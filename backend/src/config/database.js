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

console.log('🔗 Conectando a Neon...');

export const pool = new Pool({
  connectionString: connectionString,
  ssl: true,
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
});

export const connectDB = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected to Neon');
    console.log('📅 Server time:', result.rows[0].now);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('⚠️ El servidor sigue encendido, pero las rutas que usan la base de datos fallarán.');
    console.error('   Revisa que DATABASE_URL en .env sea correcta (¿cambiaste la contraseña en Neon?).');
  }
};