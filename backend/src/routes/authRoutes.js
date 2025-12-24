import express from 'express';
import passport from 'passport';
import { register, login, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
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
router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);

// ===== GOOGLE OAUTH =====
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    // Redirige al frontend con el token
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
  }
);

// ===== FACEBOOK OAUTH =====
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    // Redirige al frontend con el token
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
  }
);

// ===== ACTUALIZAR PERFIL =====
router.put('/profile', protect, async (req, res) => {
  try {
    const { nombre, idioma_objetivo, notificaciones_email } = req.body;
    
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