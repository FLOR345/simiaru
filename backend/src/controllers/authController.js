import bcrypt from 'bcryptjs';
import { pool } from '../config/database.js';
import { generateToken } from '../utils/jwt.js';
import * as emailService from '../utils/emailService.js';

export const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si existe
    const userExists = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear usuario
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, puntos_totales, nivel_actual, racha_actual) 
       VALUES ($1, $2, $3, 0, 1, 0) 
       RETURNING id, nombre, email`,
      [nombre, email, passwordHash]
    );

    const newUser = result.rows[0];

    // Enviar email de bienvenida (no bloqueante)
    emailService.sendWelcome({
      nombre: newUser.nombre,
      email: newUser.email
    }).catch(err => console.log('Error enviando email de bienvenida:', err.message));

    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        nombre: newUser.nombre,
        email: newUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    // Verificar si el usuario se registró con Google (sin contraseña)
    if (!user.password_hash) {
      return res.status(401).json({ 
        message: 'Esta cuenta fue creada con Google. Por favor, inicia sesión con Google o crea una contraseña desde tu perfil.',
        needsPassword: true 
      });
    }

    // Verificar password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        idioma_objetivo: user.idioma_objetivo,
        puntos_totales: user.puntos_totales,
        nivel_actual: user.nivel_actual,
        racha_actual: user.racha_actual
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, email, idioma_objetivo, puntos_totales, 
              nivel_actual, racha_actual, google_id, password_hash IS NOT NULL as has_password
       FROM usuarios 
       WHERE id = $1`,
      [req.user.id]
    );

    const user = result.rows[0];
    
    res.json({
      success: true,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        idioma_objetivo: user.idioma_objetivo,
        puntos_totales: user.puntos_totales,
        nivel_actual: user.nivel_actual,
        racha_actual: user.racha_actual,
        isGoogleUser: !!user.google_id,
        hasPassword: user.has_password
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { nombre, idioma_objetivo, notificaciones_email } = req.body;
    
    const result = await pool.query(
      `UPDATE usuarios 
       SET nombre = $1, idioma_objetivo = $2, notificaciones_email = $3
       WHERE id = $4
       RETURNING id, nombre, email, idioma_objetivo, notificaciones_email`,
      [nombre, idioma_objetivo, notificaciones_email, req.user.id]
    );

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Obtener usuario actual
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    // Si el usuario tiene contraseña, verificar la actual
    if (user.password_hash) {
      // Si no envió contraseña actual, error
      if (!currentPassword) {
        return res.status(400).json({ message: 'Debes ingresar tu contraseña actual' });
      }
      
      const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Contraseña actual incorrecta' });
      }
    }
    // Si es usuario de Google sin contraseña, puede crear una sin verificar

    // Validar nueva contraseña
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    // Hash nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Actualizar contraseña
    await pool.query(
      'UPDATE usuarios SET password_hash = $1 WHERE id = $2',
      [newPasswordHash, userId]
    );

    res.json({
      success: true,
      message: user.password_hash ? 'Contraseña actualizada correctamente' : 'Contraseña creada correctamente. Ahora puedes iniciar sesión con email y contraseña.'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: error.message });
  }
};