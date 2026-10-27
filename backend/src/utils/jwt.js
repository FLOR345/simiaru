import jwt from 'jsonwebtoken';

// Se lee en cada llamada para asegurar que dotenv ya cargó el .env
export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Falta JWT_SECRET en el archivo .env');
  }
  return secret;
};

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, getJwtSecret(), { expiresIn: '7d' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};
