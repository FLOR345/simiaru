// Validación de entradas, sin dependencias externas.
// Cada regla describe un campo del body; si algo no cumple, responde 400 con la lista de errores
// antes de llegar al controlador (y antes de tocar la base de datos).

const RULES = {
  string: (v, r) => typeof v === 'string' && v.trim().length >= (r.min ?? 0) && v.trim().length <= (r.max ?? Infinity),
  email: (v) => typeof v === 'string' && v.length <= 255 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  integer: (v, r) => Number.isInteger(Number(v)) && Number(v) >= (r.min ?? -Infinity) && Number(v) <= (r.max ?? Infinity),
  number: (v, r) => typeof v === 'number' && Number.isFinite(v) && v >= (r.min ?? -Infinity) && v <= (r.max ?? Infinity),
  boolean: (v) => typeof v === 'boolean',
  oneOf: (v, r) => r.values.includes(v),
  array: (v, r) => Array.isArray(v) && v.length <= (r.max ?? Infinity),
  object: (v) => v !== null && typeof v === 'object' && !Array.isArray(v),
};

const MESSAGES = {
  string: (f, r) => `${f} debe tener entre ${r.min ?? 0} y ${r.max ?? '∞'} caracteres`,
  email: (f) => `${f} no es un correo válido`,
  integer: (f) => `${f} debe ser un número entero válido`,
  number: (f) => `${f} debe ser un número válido`,
  boolean: (f) => `${f} debe ser verdadero o falso`,
  oneOf: (f, r) => `${f} debe ser uno de: ${r.values.join(', ')}`,
  array: (f, r) => `${f} debe ser una lista de hasta ${r.max ?? '∞'} elementos`,
  object: (f) => `${f} debe ser un objeto`,
};

/**
 * validate({ email: { type: 'email' }, edad: { type: 'integer', min: 0, optional: true } })
 */
export const validate = (schema, source = 'body') => (req, res, next) => {
  const data = req[source] || {};
  const errors = [];
  for (const [field, rule] of Object.entries(schema)) {
    const value = data[field];
    if (value === undefined || value === null || value === '') {
      if (!rule.optional) errors.push(`Falta ${field}`);
      continue;
    }
    const check = RULES[rule.type];
    if (!check) throw new Error(`Regla de validación desconocida: ${rule.type}`);
    if (!check(value, rule)) errors.push(MESSAGES[rule.type](field, rule));
  }
  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors });
  }
  next();
};

// Esquemas reutilizados por las rutas
export const schemas = {
  register: {
    nombre: { type: 'string', min: 1, max: 80 },
    email: { type: 'email' },
    password: { type: 'string', min: 6, max: 128 },
  },
  login: {
    email: { type: 'email' },
    password: { type: 'string', min: 1, max: 128 },
  },
  saveProgress: {
    leccionId: { type: 'integer', min: 1 },
    porcentajeAciertos: { type: 'number', min: 0, max: 100 },
  },
  events: {
    events: { type: 'array', max: 200 },
  },
  consent: {
    consiente: { type: 'boolean' },
  },
  classroom: {
    nombre: { type: 'string', min: 1, max: 80 },
    idioma: { type: 'oneOf', values: ['quechua', 'aymara'] },
  },
  joinClassroom: {
    codigo: { type: 'string', min: 6, max: 12 },
    alias: { type: 'string', min: 1, max: 40 },
  },
};
