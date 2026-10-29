-- 002: datos de aprendizaje con consentimiento, modo aula y registro de migraciones.
-- Solo agrega (CREATE ... IF NOT EXISTS / ADD COLUMN IF NOT EXISTS): no borra ni cambia datos existentes.

-- Consentimiento para registrar eventos de aprendizaje.
-- NULL = todavía no se le preguntó; true/false = respuesta de la persona.
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS consentimiento_datos BOOLEAN;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS consentimiento_fecha TIMESTAMPTZ;

-- Modo aula: cuentas de estudiante creadas con un código, sin correo ni datos personales
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS es_cuenta_aula BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS aula_id INTEGER;

CREATE TABLE IF NOT EXISTS aulas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  codigo VARCHAR(12) NOT NULL UNIQUE,
  idioma VARCHAR(20) NOT NULL DEFAULT 'quechua',
  docente_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  activa BOOLEAN NOT NULL DEFAULT true,
  creada_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'usuarios_aula_id_fkey') THEN
    ALTER TABLE usuarios ADD CONSTRAINT usuarios_aula_id_fkey FOREIGN KEY (aula_id) REFERENCES aulas(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Eventos de aprendizaje: una fila por acción. Solo se guardan con consentimiento.
-- "participante" es un seudónimo estable (HMAC del id): la exportación nunca lleva nombre ni correo.
CREATE TABLE IF NOT EXISTS eventos_aprendizaje (
  id BIGSERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  participante VARCHAR(24) NOT NULL,
  sesion VARCHAR(40),
  tipo VARCHAR(40) NOT NULL,
  idioma VARCHAR(20),
  leccion_id INTEGER,
  ejercicio_id INTEGER,
  vocabulario_id INTEGER,
  tipo_ejercicio VARCHAR(40),
  resultado VARCHAR(20),          -- correcto | variante | incorrecto
  respuesta TEXT,
  esperado TEXT,
  intento SMALLINT,
  duracion_ms INTEGER,
  metadatos JSONB NOT NULL DEFAULT '{}'::jsonb,
  ocurrido_en TIMESTAMPTZ NOT NULL,
  recibido_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eventos_usuario ON eventos_aprendizaje (usuario_id, ocurrido_en);
CREATE INDEX IF NOT EXISTS idx_eventos_tipo ON eventos_aprendizaje (tipo, ocurrido_en);
CREATE INDEX IF NOT EXISTS idx_usuarios_aula ON usuarios (aula_id);
