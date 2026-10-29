import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { pool } from './database.js';
import * as emailService from '../utils/emailService.js';

// Dirección pública del backend: BACKEND_URL si existe; en Render se detecta sola (RENDER_EXTERNAL_URL)
const BACKEND_URL = process.env.BACKEND_URL || process.env.RENDER_EXTERNAL_URL || 'http://localhost:5000';

// ========================================
// 🔵 FUNCIONES PARA BUSCAR Y CREAR USUARIOS EN POSTGRESQL
// ========================================

// Cuenta ya creada con ese correo (por ejemplo, registrada con contraseña)
async function findUserByEmail(email) {
  if (!email) return null;
  const result = await pool.query('SELECT * FROM usuarios WHERE LOWER(email) = LOWER($1) LIMIT 1', [email]);
  return result.rows[0] || null;
}

// Busca por el id del proveedor; si no, por correo (y vincula el proveedor a esa cuenta); si no, la crea.
// Antes se intentaba crear siempre una cuenta nueva y fallaba con "Ya existe un registro con estos datos".
export async function findOrLinkUser(provider, profile) {
  const column = provider === 'google' ? 'google_id' : 'facebook_id';
  const byProvider = await pool.query(`SELECT * FROM usuarios WHERE ${column} = $1 LIMIT 1`, [profile.id]);
  if (byProvider.rows[0]) return byProvider.rows[0];

  const email = profile.emails?.[0]?.value?.trim().toLowerCase() || null;
  const avatar = profile.photos?.[0]?.value || null;
  const existing = await findUserByEmail(email);
  if (existing) {
    const linked = await pool.query(
      `UPDATE usuarios SET ${column} = $1, avatar = COALESCE(avatar, $2) WHERE id = $3 RETURNING *`,
      [profile.id, avatar, existing.id]
    );
    return linked.rows[0];
  }

  return createUser({
    nombre: profile.displayName || (email ? email.split('@')[0] : 'Estudiante'),
    email,
    avatar,
    googleId: provider === 'google' ? profile.id : null,
    facebookId: provider === 'facebook' ? profile.id : null,
  });
}

async function findUserById(id) {
  const result = await pool.query(
    "SELECT * FROM usuarios WHERE id = $1 LIMIT 1",
    [id]
  );
  return result.rows[0] || null;
}

async function createUser({ nombre, email, avatar, googleId, facebookId }) {
  const result = await pool.query(
    `INSERT INTO usuarios (nombre, email, avatar, google_id, facebook_id, puntos_totales, nivel_actual, racha_actual)
     VALUES ($1, $2, $3, $4, $5, 0, 1, 0)
     RETURNING *`,
    [nombre, email, avatar, googleId, facebookId]
  );

  const newUser = result.rows[0];

  // Enviar email de bienvenida
  if (email) {
    emailService.sendWelcome({
      nombre: newUser.nombre,
      email: newUser.email
    }).catch(err => console.log('Error enviando email de bienvenida:', err.message));
  }

  return newUser;
}

// ========================================
// 🔑 JWT STRATEGY (NUEVO)
// ========================================

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await findUserById(payload.id);
      
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

// ========================================
// 🟢 GOOGLE STRATEGY
// ========================================

// Solo si hay claves: una instalación nueva (Docker, revisores) arranca sin cuentas de Google ni Facebook
export const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
export const facebookEnabled = Boolean(process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET);

if (googleEnabled) passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrLinkUser('google', profile);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// ========================================
// 🔵 FACEBOOK STRATEGY
// ========================================

if (facebookEnabled) passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/facebook/callback`,
      profileFields: ["id", "displayName", "emails", "photos"],
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrLinkUser('facebook', profile);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// ========================================
// 🟣 SERIALIZACIÓN
// ========================================

passport.serializeUser((user, done) => {
  done(null, user.id);
});

// ========================================
// 🟣 DESERIALIZACIÓN
// ========================================

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;