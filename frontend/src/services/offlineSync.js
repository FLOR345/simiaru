// Progreso sin conexión con sincronización diferida.
// Si una lección termina sin internet, el resultado se guarda en este dispositivo y se envía al volver la conexión.
import { api } from './api';

const KEY = 'simiaru-progreso-pendiente';

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
};
const write = (list) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // sin almacenamiento: no se puede guardar para después
  }
};

export const pendingProgress = () => read().length;

/** Guarda un resultado para enviarlo después (se queda con el mejor porcentaje de cada lección) */
export const queueProgress = ({ leccionId, porcentajeAciertos }) => {
  const list = read().filter((p) => !(p.leccionId === leccionId && p.porcentajeAciertos >= porcentajeAciertos));
  if (!list.some((p) => p.leccionId === leccionId)) list.push({ leccionId, porcentajeAciertos, guardado: Date.now() });
  write(list);
};

let syncing = false;
/** Envía lo pendiente. Devuelve cuántos resultados se sincronizaron. */
export const syncProgress = async () => {
  if (syncing || !navigator.onLine) return 0;
  syncing = true;
  let sent = 0;
  try {
    for (const item of read()) {
      try {
        await api.saveProgress({ leccionId: item.leccionId, porcentajeAciertos: item.porcentajeAciertos });
        write(read().filter((p) => p.leccionId !== item.leccionId));
        sent += 1;
      } catch (error) {
        // 4xx (lección inexistente, datos inválidos): se descarta; errores de red: se reintenta después
        if (error.response && error.response.status < 500) write(read().filter((p) => p.leccionId !== item.leccionId));
        else break;
      }
    }
  } finally {
    syncing = false;
  }
  return sent;
};
