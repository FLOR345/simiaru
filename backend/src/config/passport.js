import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { pool } from './database.js';
import * as emailService from '../utils/emailService.js';

// ========================================
// 🔵 FUNCIONES PARA BUSCAR Y CREAR USUARIOS EN POSTGRESQL
// ========================================

async function findUserByGoogleId(googleId) {
  const result = await pool.query(
    "SELECT * FROM usuarios WHERE google_id = $1 LIMIT 1",
    [googleId]
  );
  return result.rows[0] || null;
}

async function findUserByFacebookId(facebookId) {
  const result = await pool.query(
    "SELECT * FROM usuarios WHERE facebook_id = $1 LIMIT 1",
    [facebookId]
  );
  return result.rows[0] || null;
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
  secretOrKey: process.env.JWT_SECRET || 'simiaru_secret_key_2025_muy_segura'
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

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:"http://localhost:5000/api/auth/google/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await findUserByGoogleId(profile.id);

        // Si NO existe, crearlo
        if (!user) {
          user = await createUser({
            nombre: profile.displayName,
            email: profile.emails?.[0]?.value || null,
            avatar: profile.photos?.[0]?.value || null,
            googleId: profile.id,
            facebookId: null,
          });
        }

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

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails", "photos"],
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await findUserByFacebookId(profile.id);

        if (!user) {
          user = await createUser({
            nombre: profile.displayName,
            email: profile.emails?.[0]?.value || null,
            avatar: profile.photos?.[0]?.value || null,
            googleId: null,
            facebookId: profile.id,
          });
        }

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