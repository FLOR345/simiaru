import express from 'express';
import passport from 'passport';
import { googleEnabled, facebookEnabled } from '../config/passport.js';
import { register, login, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, schemas } from '../middleware/validation.js';
import { isKnownLanguage } from '../utils/languages.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from '../config/database.js';  // <-- AGREGAR ESTO

const router = express.Router();

// Función para generar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Rutas normales (email/password)
router.post('/register', validate(schemas.register), register);
router.post('/login', validate(schemas.login), login);
router.get('/profile', protect, getProfile);

// Si el proveedor no está configurado, se avisa en vez de fallar
const requireProvider = (enabled, name) => (req, res, next) =>
  enabled ? next() : res.status(503).json({ message: 'El inicio de sesión con ' + name + ' no está configurado en este servidor' });

// Si algo falla en Google/Facebook, se vuelve a la pantalla de inicio de sesión con un aviso legible
const FRONTEND = () => process.env.FRONTEND_URL || 'https://simiaru-3j6b.vercel.app';
const oauthCallback = (provider) => (req, res, next) => {
  passport.authenticate(provider, { session: false }, (error, user) => {
    if (error || !user) {
      console.error(`Error en el inicio de sesión con ${provider}:`, error?.message || 'sin usuario');
      return res.redirect(`${FRONTEND()}/login?error=${provider}`);
    }
    return res.redirect(`${FRONTEND()}/dashboard?token=${generateToken(user)}`);
  })(req, res, next);
};

// ===== GOOGLE OAUTH =====
router.get('/google', requireProvider(googleEnabled, 'Google'), passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', requireProvider(googleEnabled, 'Google'), oauthCallback('google'));

// ===== FACEBOOK OAUTH =====
router.get('/facebook', requireProvider(facebookEnabled, 'Facebook'), passport.authenticate('facebook', {
  scope: ['email']
}));

router.get('/facebook/callback', requireProvider(facebookEnabled, 'Facebook'), oauthCallback('facebook'));

// ===== ACTUALIZAR PERFIL =====
router.put('/profile', protect, async (req, res) => {
  try {
    const nombre = String(req.body.nombre ?? '').trim();
    const idioma_objetivo = req.body.idioma_objetivo;

    if (nombre.length < 1 || nombre.length > 80) {
      return res.status(400).json({ message: 'El nombre debe tener entre 1 y 80 caracteres' });
    }
    if (!(await isKnownLanguage(idioma_objetivo))) {
      return res.status(400).json({ message: 'Elige un idioma disponible' });
    }

    await pool.query(
      `UPDATE usuarios SET nombre = $1, idioma_objetivo = $2 WHERE id = $3`,
      [nombre, idioma_objetivo, req.user.id]
    );
    
    res.json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
});

// ===== CAMBIAR CONTRASEÑA =====
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Obtener usuario actual
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE id = $1', [req.user.id]);
    const user = rows[0];
    
    // Si el usuario tiene contraseña, verificar la actual
    if (user.password_hash) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Debes ingresar tu contraseña actual' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
      }
    }
    // Si NO tiene password_hash (usuario de Google), puede crear sin verificar
    
    // Validar nueva contraseña
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }
    
    // Hashear nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Actualizar
    await pool.query('UPDATE usuarios SET password_hash = $1 WHERE id = $2', [hashedPassword, req.user.id]);
    
    const message = user.password_hash 
      ? 'Contraseña cambiada correctamente' 
      : '¡Contraseña creada! Ahora puedes iniciar sesión con tu email y contraseña.';
    
    res.json({ message, success: true });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error al cambiar la contraseña' });
  }
});
export default router;