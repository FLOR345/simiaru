// Sonidos cortos de la lección, sintetizados con Web Audio (sin archivos que descargar).
// Se pueden silenciar; la preferencia se recuerda en este dispositivo.
const KEY = 'simiaru-sonido';
let ctx;

export const soundEnabled = () => {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
};
export const setSoundEnabled = (on) => {
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    // sin almacenamiento: dura solo esta visita
  }
};

const tone = (freq, start, duration, type = 'sine', gain = 0.12) => {
  const osc = ctx.createOscillator();
  const vol = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
  vol.gain.setValueAtTime(0, ctx.currentTime + start);
  vol.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.01);
  vol.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
  osc.connect(vol).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration + 0.02);
};

const play = (notes) => {
  if (!soundEnabled()) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    notes.forEach((n) => tone(...n));
  } catch {
    // navegador sin Web Audio: sin sonido
  }
};

// Acierto: dos notas que suben (do6 → mi6)
export const playCorrect = () => play([[1046.5, 0, 0.12, 'sine'], [1318.5, 0.09, 0.22, 'sine']]);
// Error: una nota grave y corta, sin estridencia
export const playWrong = () => play([[220, 0, 0.18, 'triangle', 0.14], [196, 0.12, 0.25, 'triangle', 0.12]]);
// Lección terminada: arpegio
export const playComplete = () =>
  play([[523.3, 0, 0.15], [659.3, 0.12, 0.15], [784, 0.24, 0.15], [1046.5, 0.36, 0.4]]);
// Toque suave al elegir una opción o una ficha
export const playTap = () => play([[660, 0, 0.05, 'sine', 0.05]]);
// Pareja encontrada: una nota corta y brillante
export const playMatch = () => play([[880, 0, 0.08, 'sine', 0.08], [1174.7, 0.06, 0.12, 'sine', 0.07]]);
