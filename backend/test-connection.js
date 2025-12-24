import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  password: 'simiaru123',
  host: 'localhost',
  port: 5432,
  database: 'simiaru'
});

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Conexión exitosa!');
    console.log('Hora del servidor:', result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('Detalles completos:', error);
    process.exit(1);
  }
}

testConnection();