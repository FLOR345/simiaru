// Registro de eventos de aprendizaje (contribución 3 del artículo: datos exportables a nivel de evento).
// - Solo con consentimiento explícito (usuario.consentimiento_datos === true). En modo invitado no se registra nada.
// - Los eventos esperan en una cola local (sobreviven a recargas y a la falta de internet) y se envían en lotes:
//   es la "sincronización diferida" de la PWA.
import { API_URL } from '../config';

const QUEUE_KEY = 'simiaru-eventos-pendientes';
const SESSION_KEY = 'simiaru-sesion';
const MAX_QUEUE = 1000;
const BATCH = 100;

const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const writeJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // almacenamiento lleno o bloqueado: los eventos se pierden, la app sigue funcionando
  }
};

const currentUser = () => readJson('user', null);
const token = () => {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
};

export const hasConsent = () => currentUser()?.consentimiento_datos === true && Boolean(token());

// Identificador de la sesión de estudio (cambia cada vez que se abre la app)
const sessionId = (() => {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`).slice(0, 36);
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `${Date.now()}`;
  }
})();

/** track('exercise_answered', { leccion_id, ejercicio_id, resultado, ... }) */
export const track = (tipo, data = {}) => {
  if (!hasConsent()) return;
  const queue = readJson(QUEUE_KEY, []);
  queue.push({ tipo, sesion: sessionId, ocurrido_en: new Date().toISOString(), ...data });
  writeJson(QUEUE_KEY, queue.slice(-MAX_QUEUE));
};

export const pendingCount = () => readJson(QUEUE_KEY, []).length;

let flushing = false;
/** Envía la cola en lotes. useBeacon=true al cerrar la pestaña (keepalive). */
export const flush = async ({ keepalive = false } = {}) => {
  if (flushing || !hasConsent() || !navigator.onLine) return;
  flushing = true;
  try {
    let queue = readJson(QUEUE_KEY, []);
    while (queue.length > 0) {
      const batch = queue.slice(0, BATCH);
      const res = await fetch(`${API_URL}/api/research/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ events: batch }),
        keepalive,
      });
      if (!res.ok) break;
      queue = readJson(QUEUE_KEY, []).slice(batch.length);
      writeJson(QUEUE_KEY, queue);
    }
  } catch {
    // sin conexión o servidor dormido: se reintenta más tarde
  } finally {
    flushing = false;
  }
};

/** Si la persona retira el consentimiento, se descarta lo que esperaba en la cola */
export const clearQueue = () => writeJson(QUEUE_KEY, []);

// Envío automático: cada 20 s, al volver la conexión y al ocultar la pestaña
let started = false;
export const startTelemetry = () => {
  if (started || typeof window === 'undefined') return;
  started = true;
  setInterval(() => flush(), 20000);
  window.addEventListener('online', () => flush());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush({ keepalive: true });
  });
  flush();
};
