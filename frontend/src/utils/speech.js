// Pronunciación: audio MMS pregenerado (modelo entrenado en la lengua) si la palabra lo tiene;
// si no, la voz del navegador como respaldo (no distingue glotalizadas ni aspiradas).
// "slow" baja la velocidad para distinguir mejor cada sonido.
export const speak = (text, { url, lang, slow = false } = {}) => {
  const browserVoice = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang || 'es-PE';
    utterance.rate = slow ? 0.5 : 0.8;
    window.speechSynthesis.speak(utterance);
  };
  if (url) {
    const audio = new Audio(url);
    audio.playbackRate = slow ? 0.7 : 1;
    audio.play().catch(browserVoice);
  } else {
    browserVoice();
  }
};
