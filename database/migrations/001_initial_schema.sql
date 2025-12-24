-- Usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  idioma_objetivo VARCHAR(20) DEFAULT 'quechua',
  puntos_totales INTEGER DEFAULT 0,
  nivel_actual INTEGER DEFAULT 1,
  racha_actual INTEGER DEFAULT 0,
  fecha_registro TIMESTAMP DEFAULT NOW(),
  ultima_actividad TIMESTAMP DEFAULT NOW()
);

-- Unidades
CREATE TABLE unidades (
  id SERIAL PRIMARY KEY,
  numero INTEGER NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  idioma VARCHAR(20) NOT NULL,
  orden INTEGER NOT NULL,
  icono_url VARCHAR(255)
);

-- Lecciones
CREATE TABLE lecciones (
  id SERIAL PRIMARY KEY,
  unidad_id INTEGER REFERENCES unidades(id) ON DELETE CASCADE,
  numero INTEGER NOT NULL,
  titulo VARCHAR(100) NOT NULL,
  contenido_teorico TEXT,
  orden INTEGER NOT NULL
);

-- Vocabulario
CREATE TABLE vocabulario (
  id SERIAL PRIMARY KEY,
  leccion_id INTEGER REFERENCES lecciones(id) ON DELETE CASCADE,
  palabra_español VARCHAR(100) NOT NULL,
  palabra_objetivo VARCHAR(100) NOT NULL,
  audio_url VARCHAR(255),
  categoria VARCHAR(50),
  ejemplo_uso TEXT
);

-- Ejercicios
CREATE TABLE ejercicios (
  id SERIAL PRIMARY KEY,
  leccion_id INTEGER REFERENCES lecciones(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL, -- 'multiple_choice', 'listen_write', 'drag_words', 'memory'
  pregunta TEXT NOT NULL,
  respuesta_correcta TEXT NOT NULL,
  opciones JSONB,
  audio_url VARCHAR(255)
);

-- Progreso Usuario
CREATE TABLE progreso_usuario (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  leccion_id INTEGER REFERENCES lecciones(id) ON DELETE CASCADE,
  completado BOOLEAN DEFAULT FALSE,
  porcentaje_aciertos INTEGER,
  fecha_completado TIMESTAMP DEFAULT NOW(),
  UNIQUE(usuario_id, leccion_id)
);

-- Insignias
CREATE TABLE insignias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  icono_url VARCHAR(255),
  condicion VARCHAR(100) -- 'complete_unit_1', 'streak_7_days', etc.
);

-- Insignias Usuario
CREATE TABLE usuario_insignias (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  insignia_id INTEGER REFERENCES insignias(id) ON DELETE CASCADE,
  fecha_obtenida TIMESTAMP DEFAULT NOW(),
  UNIQUE(usuario_id, insignia_id)
);

-- Contenido Cultural
CREATE TABLE contenido_cultural (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL, -- 'proverbio', 'cancion', 'cuento', 'adivinanza'
  idioma VARCHAR(20) NOT NULL,
  titulo VARCHAR(200),
  contenido_original TEXT NOT NULL,
  traduccion TEXT,
  audio_url VARCHAR(255),
  imagen_url VARCHAR(255)
);

-- Índices
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_progreso_usuario ON progreso_usuario(usuario_id, leccion_id);
CREATE INDEX idx_vocabulario_leccion ON vocabulario(leccion_id);
CREATE INDEX idx_ejercicios_leccion ON ejercicios(leccion_id);