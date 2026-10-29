// Pruebas de integración contra una base PostgreSQL de prueba (en CI o Docker), nunca la de producción.
// Requieren TEST_DATABASE_URL con el esquema y el contenido cargados (ver .github/workflows/ci.yml).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

const url = process.env.TEST_DATABASE_URL;
const skip = !url ? 'sin TEST_DATABASE_URL: se omiten las pruebas con base de datos' : false;
if (url && /neon\.tech|render\.com|supabase/i.test(url)) {
  throw new Error('TEST_DATABASE_URL apunta a una base en la nube: las pruebas solo corren contra una base local o de CI');
}

let request;
let app;
let pool;
const unique = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
const user = { nombre: 'Prueba', email: `prueba${unique}@ejemplo.test`, password: 'clave-segura-123' };
let token;
let lessonId;

before(async () => {
  if (skip) return;
  process.env.DATABASE_URL = url;
  process.env.DATABASE_SSL = 'false';
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET ||= 'secreto-de-prueba';
  process.env.SESSION_SECRET ||= 'sesion-de-prueba';
  process.env.ADMIN_EMAILS = `admin${unique}@ejemplo.test`;
  ({ default: request } = await import('supertest'));
  ({ default: app } = await import('../src/app.js'));
  ({ pool } = await import('../src/config/database.js'));
  const { rows } = await pool.query(
    "SELECT l.id FROM lecciones l JOIN unidades u ON u.id = l.unidad_id WHERE u.idioma = 'quechua' ORDER BY u.orden, l.orden LIMIT 1"
  );
  lessonId = rows[0]?.id;
});

after(async () => {
  if (pool) await pool.end();
});

const auth = () => ({ Authorization: `Bearer ${token}` });

test('salud y rutas inexistentes', { skip }, async () => {
  await request(app).get('/health').expect(200);
  const res = await request(app).get('/api/no-existe').expect(404);
  assert.match(res.body.message, /No se encontró la ruta/);
});

test('el contenido está cargado (lecciones, vocabulario)', { skip }, async () => {
  const res = await request(app).get('/api/lessons/units?idioma=quechua').expect(200);
  assert.ok(res.body.units.length > 0);
  assert.ok(lessonId, 'hay al menos una lección de quechua');
});

test('registro, login y perfil (con consentimiento sin responder)', { skip }, async () => {
  await request(app).post('/api/auth/register').send({ ...user, email: 'no-es-correo' }).expect(400);
  await request(app).post('/api/auth/register').send(user).expect((r) => assert.ok([200, 201].includes(r.status), r.text));
  const login = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password }).expect(200);
  token = login.body.token;
  assert.ok(token);
  const profile = await request(app).get('/api/auth/profile').set(auth()).expect(200);
  assert.equal(profile.body.user.consentimiento_datos, null);
  await request(app).get('/api/auth/profile').expect(401);
});

test('guardar progreso: puntos, racha diaria e insignia de primera lección', { skip }, async () => {
  await request(app).post('/api/progress/save').set(auth()).send({ leccionId: lessonId, porcentajeAciertos: 150 }).expect(400);
  const first = await request(app).post('/api/progress/save').set(auth()).send({ leccionId: lessonId, porcentajeAciertos: 90 }).expect(200);
  assert.equal(first.body.puntos, 90);
  assert.equal(first.body.racha, 1);
  const second = await request(app).post('/api/progress/save').set(auth()).send({ leccionId: lessonId, porcentajeAciertos: 50 }).expect(200);
  assert.equal(second.body.racha, 1, 'la racha no sube dos veces el mismo día');
  const progress = await request(app).get('/api/progress').set(auth()).expect(200);
  const row = progress.body.progress.find((p) => p.leccion_id === lessonId);
  assert.equal(row.porcentaje_aciertos, 90, 'se conserva el mejor resultado');
  assert.equal(row.completado, true);
});

test('eventos: sin consentimiento no se guarda nada; con consentimiento se guardan y se exportan', { skip }, async () => {
  const event = { tipo: 'exercise_answered', idioma: 'quechua', leccion_id: lessonId, resultado: 'variante', respuesta: 'allin punchay', esperado: "allin p'unchay", ocurrido_en: new Date().toISOString() };
  const without = await request(app).post('/api/research/events').set(auth()).send({ events: [event] }).expect(200);
  assert.equal(without.body.guardados, 0);

  await request(app).put('/api/research/consent').set(auth()).send({ consiente: true }).expect(200);
  const saved = await request(app).post('/api/research/events').set(auth()).send({ events: [event, { tipo: 'tipo_inventado' }] }).expect(200);
  assert.equal(saved.body.guardados, 1, 'los tipos desconocidos se descartan');

  const json = await request(app).get('/api/research/export/me?format=json').set(auth()).expect(200);
  assert.equal(json.body.total, 1);
  assert.equal(json.body.eventos[0].resultado, 'variante');
  assert.ok(!('usuario_id' in json.body.eventos[0]), 'la exportación no lleva el id interno');
  assert.equal(json.body.eventos[0].participante.length, 16);

  const csv = await request(app).get('/api/research/export/me?format=csv').set(auth()).expect(200);
  assert.match(csv.headers['content-type'], /text\/csv/);
  assert.match(csv.text, /participante,sesion,tipo/);

  await request(app).get('/api/research/export').set(auth()).expect(403); // solo administradores

  const deleted = await request(app).delete('/api/research/events/me').set(auth()).expect(200);
  assert.equal(deleted.body.borrados, 1);
});

test('modo aula: crear, unirse sin correo, volver a entrar con el código y ver el avance', { skip }, async () => {
  const created = await request(app).post('/api/classroom').set(auth()).send({ nombre: 'Quechua I', idioma: 'quechua' }).expect(201);
  const { codigo, id } = created.body.aula;
  assert.match(codigo, /^[A-Z2-9]{6}$/);

  await request(app).post('/api/classroom/join').send({ codigo: 'NOEXIS', alias: 'Ana' }).expect(404);
  const joined = await request(app).post('/api/classroom/join').send({ codigo: codigo.toLowerCase(), alias: 'Ana' }).expect(201);
  assert.match(joined.body.codigoEstudiante, /^[A-Z2-9]{6}-[A-Z2-9]{4}$/);
  assert.equal(joined.body.user.es_cuenta_aula, true);

  const profile = await request(app).get('/api/auth/profile').set({ Authorization: `Bearer ${joined.body.token}` }).expect(200);
  assert.equal(profile.body.user.email, null, 'la cuenta de aula no expone el correo interno');

  await request(app).post('/api/classroom/login').send({ codigoEstudiante: 'AAAAAA-BBBB' }).expect(401);
  await request(app).post('/api/classroom/login').send({ codigoEstudiante: joined.body.codigoEstudiante }).expect(200);

  // La cuenta de estudiante no puede crear aulas
  await request(app).post('/api/classroom').set({ Authorization: `Bearer ${joined.body.token}` }).send({ nombre: 'X', idioma: 'quechua' }).expect(403);

  const progress = await request(app).get(`/api/classroom/${id}/progress`).set(auth()).expect(200);
  assert.deepEqual(progress.body.estudiantes.map((s) => s.alias), ['Ana']);
  await request(app).get(`/api/classroom/${id}/progress`).set({ Authorization: `Bearer ${joined.body.token}` }).expect(404);
});
