import jwt from 'jsonwebtoken';

const JWT_SECRET = 'simiaru_secret_key_2025_muy_segura';

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};