/**
 * Clase de error personalizada para la aplicación
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Maneja errores de PostgreSQL
 */
const handleDatabaseError = (error) => {
  // Errores comunes de PostgreSQL
  if (error.code === '23505') { // Violación de unicidad
    return new AppError('Ya existe un registro con estos datos', 409);
  }
  
  if (error.code === '23503') { // Violación de llave foránea
    return new AppError('Referencia a un registro inexistente', 400);
  }
  
  if (error.code === '22P02') { // Sintaxis inválida en query
    return new AppError('Datos inválidos proporcionados', 400);
  }

  if (error.code === '42P01') { // Tabla no existe
    return new AppError('Recurso no encontrado en la base de datos', 500);
  }

  // Error genérico de base de datos
  return new AppError('Error en la base de datos', 500);
};

/**
 * Maneja errores de validación
 */
const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map(el => el.message);
  const message = `Datos inválidos: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Envía respuesta de error en desarrollo
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

/**
 * Envía respuesta de error en producción
 */
const sendErrorProd = (err, res) => {
  // Errores operacionales confiables: enviar mensaje al cliente
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message
    });
  } 
  // Errores de programación o desconocidos: no filtrar detalles
  else {
    console.error('ERROR 💥', err);
    
    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Algo salió mal en el servidor'
    });
  }
};

/**
 * Middleware global de manejo de errores
 */
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    // Manejar diferentes tipos de errores
    if (err.code) error = handleDatabaseError(err);
    if (err.name === 'ValidationError') error = handleValidationError(err);
    if (err.name === 'JsonWebTokenError') error = new AppError('Token inválido', 401);
    if (err.name === 'TokenExpiredError') error = new AppError('Token expirado', 401);

    sendErrorProd(error, res);
  }
};

/**
 * Maneja rutas no encontradas
 */
export const notFound = (req, res, next) => {
  const error = new AppError(
    `No se encontró la ruta ${req.originalUrl} en este servidor`,
    404
  );
  next(error);
};

/**
 * Wrapper para funciones async - captura errores automáticamente
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};