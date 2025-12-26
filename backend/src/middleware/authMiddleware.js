import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'simiaru_secret_key_2025_muy_segura';

// Protección obligatoria - requiere token válido
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No autorizado - Token no proporcionado' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Protección opcional - permite acceso sin token (para modo invitado)
export const optionalProtect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      // Si hay token, intentar verificarlo
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
      } catch (error) {
        // Token inválido, pero permitir continuar como invitado
        req.user = null;
      }
    } else {
      // Sin token = modo invitado
      req.user = null;
    }
    
    next();
  } catch (error) {
    // En caso de error, continuar como invitado
    req.user = null;
    next();
  }
};

// Verificar si es admin
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'No autorizado' 
      });
    }

    if (req.user.rol !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Acceso denegado. Se requiere rol de administrador' 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error en verificación de admin' 
    });
  }
};