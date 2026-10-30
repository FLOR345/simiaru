// Palabras difíciles: las que la persona falló en las lecciones, guardadas en este dispositivo
// para repasarlas en Juegos ("Tus palabras difíciles"). Cada una sale de la lista
// cuando se acierta 2 veces seguidas en el repaso.
const key = (idioma) => `simiaru-dificiles-${idioma}`;
const MAX = 60;

const norm = (t) =>
  String(t ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’‘´`ʼ]/g, "'")
    .replace(/[^a-zñ' ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const readDifficult = (idioma) => {
  try {
    return JSON.parse(localStorage.getItem(key(idioma)) || '[]');
  } catch {
    return [];
  }
};

const write = (idioma, list) => {
  try {
    localStorage.setItem(key(idioma), JSON.stringify(list.slice(0, MAX)));
  } catch {
    // sin almacenamiento: no se guardan
  }
};

// Busca en el vocabulario de la lección las palabras que corresponden a las respuestas falladas
export const saveMistakes = (idioma, mistakes, vocabulary) => {
  if (!idioma || !mistakes?.length || !vocabulary?.length) return 0;
  const wanted = mistakes.map(norm).filter(Boolean);
  const found = vocabulary.filter((v) => {
    const t = norm(v.palabra_objetivo);
    const e = norm(v.palabra_espanol);
    return wanted.some((w) => w === t || w === e || (w.length > 3 && (t.includes(w) || w.includes(t) || e === w)));
  });
  if (!found.length) return 0;
  const list = readDifficult(idioma);
  found.forEach((v) => {
    const i = list.findIndex((x) => x.id === v.id);
    const item = { id: v.id, target: v.palabra_objetivo.trim(), spanish: v.palabra_espanol.trim(), audio: v.audio_url, example: v.ejemplo_uso, aciertos: 0 };
    if (i >= 0) list.splice(i, 1);
    list.unshift(item);
  });
  write(idioma, list);
  return found.length;
};

// Resultado de repasar una palabra difícil: 2 aciertos seguidos y sale de la lista
export const reviewDifficult = (idioma, id, knew) => {
  const list = readDifficult(idioma);
  const i = list.findIndex((x) => x.id === id);
  if (i < 0) return;
  if (knew) {
    list[i].aciertos = (list[i].aciertos || 0) + 1;
    if (list[i].aciertos >= 2) list.splice(i, 1);
  } else {
    list[i].aciertos = 0;
  }
  write(idioma, list);
};
