// Fotos para las respuestas de las adivinanzas e íconos para los proverbios (solo íconos, sin emojis).
// Las fotos son de Wikimedia Commons con licencia abierta; su crédito está en adivinanzasCreditos.json
// (el maíz y las estrellas reutilizan las fotos de los cuentos, con su crédito en cuentosCreditos.json).
import { GiShakingHands, GiSickle, GiOwl, GiEarthAmerica, GiWheat, GiFootprint, GiCookingPot, GiSun, GiScales, GiField, GiCondorEmblem, GiFamilyHouse } from 'react-icons/gi';
import { PiHandHeart, PiUsersThree } from 'react-icons/pi';
import { Quote } from 'lucide-react';
import CREDITOS_ADIV from './adivinanzasCreditos.json';
import CREDITOS_CUENTOS from './cuentosCreditos.json';

const FOTOS = Object.fromEntries(
  [
    ...Object.entries(import.meta.glob('../assets/adivinanzas/*.webp', { eager: true, import: 'default' })),
    ...Object.entries(import.meta.glob('../assets/cuentos/{sara,warana}.webp', { eager: true, import: 'default' })),
  ].map(([path, url]) => [path.split('/').pop().replace('.webp', ''), url])
);

const plain = (s) =>
  String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

// [respuesta (en el título o la explicación), foto, texto alternativo]
const RESPUESTAS = [
  [/\b(maiz|sara)\b/, 'sara', 'Mazorcas de maíz andino de muchos colores'],
  [/\b(ojo|ojos|nawi|esclerotica|pupila)\b/, 'ojo', 'Un ojo humano visto de cerca'],
  [/\b(lengua|qallu)\b/, 'lengua', 'Albert Einstein sacando la lengua'],
  [/\b(huevo|runtu)\b/, 'huevo', 'Huevos de gallina en un nido de paja'],
  [/\b(estrella|estrellas|quyllur)\b/, 'warana', 'La Vía Láctea sobre un cerro de los Andes'],
  [/\b(rio|mayu|jawira)\b/, 'rio', 'El río Urubamba entre los cerros del Cusco'],
  [/\b(cometa|volantin)\b/, 'cometa', 'Una cometa vuela contra el sol'],
  [/\b(sol|inti)\b/, 'sol', 'Amanecer sobre los Andes'],
  [/\b(cebolla)\b/, 'cebolla', 'Cebollas rojas'],
  [/\b(camino|thaki|thakhi)\b/, 'camino', 'Un tramo del Qhapaq Ñan, el camino inca'],
  [/\b(papa|ch'uqi|chuqi)\b/, 'papa', 'Variedades de papa nativa del Cusco'],
  [/\b(pensamiento|amuyu)\b/, 'pensamiento', 'El pensador, escultura de Rodin'],
];

const credito = (key) => {
  const c = CREDITOS_ADIV[key] || CREDITOS_CUENTOS[key];
  return c ? { autor: c.autor || 'Autor desconocido', licencia: c.licencia, pagina: c.pagina } : null;
};

// Busca primero en lo que dice la explicación sobre la respuesta y luego en el título
export const riddlePhoto = (item) => {
  const exp = plain(item?.explicacion);
  const answerPart = /respuesta(?: es|:)?\s*([^.]+)/.exec(exp)?.[1] || /describe al?\s*([^.]+)/.exec(exp)?.[1] || '';
  for (const text of [answerPart, plain(item?.titulo), exp]) {
    const hit = RESPUESTAS.find(([re]) => re.test(text));
    if (hit && FOTOS[hit[1]]) return { src: FOTOS[hit[1]], alt: hit[2], credito: credito(hit[1]), posicion: hit[1] === 'lengua' ? '50% 72%' : '50% 50%' };
  }
  return null;
};

// Ícono para cada proverbio según de qué habla
const PROVERBIOS = [
  [/\b(ama sua|ladron|mentir|robes|mientas|perezoso|ocioso)/, GiScales],
  [/\b(ayni|reciprocidad|minka|mink'a)/, GiShakingHands],
  [/\b(union|unidos|unidad|juntos|una sola mano|todos debemos)/, PiUsersThree],
  [/\b(sabiduria|sabe|ancestr)/, GiOwl],
  [/\b(caminar|camino)/, GiFootprint],
  [/\b(trabajo comunitario)/, PiUsersThree],
  [/\b(trabajo|trabaja|trabajar)/, GiSickle],
  [/\b(verdad|luz)/, GiSun],
  [/\b(respeto|respeta)/, PiHandHeart],
  [/\b(cosecha)/, GiWheat],
  [/\b(pachamama|madre tierra)/, GiEarthAmerica],
  [/\b(comer|comida|manana)/, GiCookingPot],
  [/\b(vivir bien|vida|persona)/, GiField],
  [/\b(condor|apu)/, GiCondorEmblem],
  [/\b(familia|ayllu)/, GiFamilyHouse],
];

export const proverbIcon = (item) => {
  const text = plain(`${item?.titulo} ${item?.traduccion} ${item?.explicacion}`);
  return PROVERBIOS.find(([re]) => re.test(text))?.[1] || Quote;
};
