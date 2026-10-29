import 'dotenv/config';

// Verificar que existan las variables obligatorias antes de arrancar
const requiredEnv = ['DATABASE_URL', 'JWT_SECRET', 'SESSION_SECRET'];
const missingEnv = requiredEnv.filter((name) => !process.env[name]);
if (missingEnv.length > 0) {
  console.error(`❌ Faltan variables en .env: ${missingEnv.join(', ')}`);
  console.error('   Copia backend/.env.example a backend/.env y complétalo.');
  process.exit(1);
}

// Imports dinámicos: así las variables ya están validadas cuando se cargan los módulos
const { default: app } = await import('./app.js');
const { connectDB } = await import('./config/database.js');
const { initCronJobs } = await import('./utils/cronJobs.js');

// Conectar DB: si no responde al arrancar, el servidor se detiene (fail-fast) en vez de quedar a medias
try {
  await connectDB();
} catch (error) {
  console.error('❌ No se pudo conectar a la base de datos:', error.message);
  process.exit(1);
}

initCronJobs();

const PORT = process.env.PORT || 5000;
// '0.0.0.0' permite que Render reciba las peticiones
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});
