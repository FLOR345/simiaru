import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = 'postgresql://neondb_owner:npg_hkjRGt1yl0mz@ep-fancy-boat-acnwlqpn-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require';

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
    // No cerrar el proceso, intentar continuar
    console.log('⚠️ Continuando sin base de datos...');
  }
};