import 'dotenv/config';

// Verificar que existan las variables obligatorias antes de arrancar
const requiredEnv = ['DATABASE_URL', 'JWT_SECRET', 'SESSION_SECRET'];
const missingEnv = requiredEnv.filter((name) => !process.env[name]);
if (missingEnv.length > 0) {
  console.error(`❌ Faltan variables en .env: ${missingEnv.join(', ')}`);
  console.error('   Copia backend/.env.example a backend/.env y complétalo.');
  process.exit(1);
}

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { connectDB } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import dictionaryRoutes from './routes/dictionaryRoutes.js';
import cultureRoutes from './routes/cultureRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import researchRoutes from './routes/researchRoutes.js';
import classroomRoutes from './routes/classroomRoutes.js';
import { initCronJobs } from './utils/cronJobs.js';

const app = express();

// Render (y otros servicios) ponen un proxy delante: necesario para cookies seguras
app.set('trust proxy', 1);

// Middleware CORS configurado
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://simiaru-3j6b.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

// Cabeceras de seguridad (la API no sirve HTML, así que la política de contenido es mínima)
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Límite de peticiones: generoso para el uso normal, estricto para el inicio de sesión y el registro
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 600, standardHeaders: 'draft-7', legacyHeaders: false });
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.' },
});
app.use('/api', apiLimiter);
app.use(['/api/auth/login', '/api/auth/register', '/api/auth/change-password', '/api/classroom/join', '/api/classroom/login'], authLimiter);

app.use(express.json({ limit: '200kb' }));

// ===== CONFIGURAR SESIONES (para Passport) =====
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// ===== IMPORTAR E INICIALIZAR PASSPORT DE FORMA DINÁMICA =====
const passportModule = await import('./config/passport.js');
const passport = passportModule.default;

app.use(passport.initialize());
app.use(passport.session());

// Conectar DB: si no responde al arrancar, el servidor se detiene (fail-fast) en vez de quedar a medias
try {
  await connectDB();
} catch (error) {
  console.error('❌ No se pudo conectar a la base de datos:', error.message);
  process.exit(1);
}

// ===== RUTAS =====
app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/dictionary', dictionaryRoutes);
app.use('/api/culture', cultureRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/classroom', classroomRoutes);

// ===== RUTA DE SALUD (para verificar que el servidor funciona) =====
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT 
  });
});

// ===== RUTAS INEXISTENTES Y ERRORES (errorHandler existía pero nunca se montaba) =====
app.use(notFound);
app.use(errorHandler);

// ===== INICIAR TAREAS PROGRAMADAS =====
initCronJobs();

// ===== INICIAR SERVIDOR =====
const PORT = process.env.PORT || 5000;

// '0.0.0.0' permite que Render reciba las peticiones
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Google OAuth: Configurado`);
  console.log(`✅ Facebook OAuth: Configurado`);
  console.log(`📅 Server time: ${new Date().toISOString()}`);
});

// ===== MANEJO DE ERRORES =====
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});