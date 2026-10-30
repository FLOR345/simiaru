// Partes del cuerpo y números en quechua (collao/cusqueño) y aimara, para la sección "Mi cuerpo y los números".
// x, y: punto de la parte en la ilustración (viewBox 0 0 400 760); art: artículo en castellano.
// Frases: "Este es mi…" (Kayqa umaymi / Akax p'iqijawa) y "Toca tu…" (Umaykita llamiy / P'iqima llamkt'am).

export const PARTES = [
  { id: 'cabeza', es: 'cabeza', art: 'la', quechua: 'uma', aymara: "p'iqi", x: 200, y: 64, r: 30 },
  { id: 'cabello', es: 'cabello', art: 'el', quechua: 'chukcha', aymara: "ñik'uta", x: 152, y: 96, r: 22 },
  { id: 'cara', es: 'cara', art: 'la', quechua: 'uya', aymara: 'ajanu', x: 242, y: 160, r: 20 },
  { id: 'ojo', es: 'ojo', art: 'el', quechua: 'ñawi', aymara: 'nayra', x: 176, y: 126, r: 16 },
  { id: 'oreja', es: 'oreja', art: 'la', quechua: 'ninri', aymara: 'jinchu', x: 134, y: 138, r: 17 },
  { id: 'nariz', es: 'nariz', art: 'la', quechua: 'sinqa', aymara: 'nasa', x: 200, y: 146, r: 14 },
  { id: 'boca', es: 'boca', art: 'la', quechua: 'simi', aymara: 'laka', x: 200, y: 176, r: 16 },
  { id: 'cuello', es: 'cuello', art: 'el', quechua: 'kunka', aymara: 'kunka', x: 200, y: 210, r: 16 },
  { id: 'pecho', es: 'pecho', art: 'el', quechua: 'qhasqu', aymara: 'ch\'iqa', x: 236, y: 314, r: 22, soloQuechua: true },
  { id: 'corazon', es: 'corazón', art: 'el', quechua: 'sunqu', aymara: 'lluqu', x: 170, y: 300, r: 18 },
  { id: 'barriga', es: 'barriga', art: 'la', quechua: 'wiksa', aymara: 'puraka', x: 200, y: 374, r: 24 },
  { id: 'brazo', es: 'brazo', art: 'el', quechua: 'rikra', aymara: 'ampara', x: 116, y: 392, r: 20, soloQuechua: true },
  { id: 'codo', es: 'codo', art: 'el', quechua: 'kuchuch', aymara: 'mujlli', x: 296, y: 382, r: 16, soloAymara: true },
  { id: 'mano', es: 'mano', art: 'la', quechua: 'maki', aymara: 'ampara', x: 104, y: 470, r: 22 },
  { id: 'dedo', es: 'dedo', art: 'el', quechua: "ruk'ana", aymara: "luk'ana", x: 300, y: 494, r: 15 },
  { id: 'rodilla', es: 'rodilla', art: 'la', quechua: 'muqu', aymara: 'qunquri', x: 172, y: 600, r: 18 },
  { id: 'pie', es: 'pie', art: 'el', quechua: 'chaki', aymara: 'kayu', x: 230, y: 708, r: 22 },
];

// Partes de cada lengua (algunas se dicen solo con seguridad en una de ellas)
export const partesDe = (idioma) => PARTES.filter((p) => (idioma === 'aymara' ? !p.soloQuechua : !p.soloAymara));

const vocal = (w) => /[aeiouäïü]$/i.test(w);

// "Este es mi…" / "Toca tu…"
export const frasesParte = (p, idioma) => {
  const w = p[idioma];
  const mi = p.art === 'la' ? 'Esta es mi' : 'Este es mi';
  if (idioma === 'aymara') {
    const mia = w + (vocal(w) ? 'ja' : 'ija');
    const tuya = w + (vocal(w) ? 'ma' : 'ima');
    return {
      es: { original: `Akax ${mia}wa.`, traduccion: `${mi} ${p.es}.` },
      toca: { original: `${cap(tuya)} llamkt'am.`, traduccion: `Toca tu ${p.es}.` },
    };
  }
  const mia = w + (vocal(w) ? 'y' : 'niy');
  const tuya = w + (vocal(w) ? 'yki' : 'niyki');
  return {
    es: { original: `Kayqa ${mia}mi.`, traduccion: `${mi} ${p.es}.` },
    toca: { original: `${cap(tuya)}ta llamiy.`, traduccion: `Toca tu ${p.es}.` },
  };
};

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ==================== Números ====================
const Q_UNI = ['', 'huk', 'iskay', 'kimsa', 'tawa', 'pichqa', 'suqta', 'qanchis', 'pusaq', 'isqun'];
const A_UNI = ['', 'maya', 'paya', 'kimsa', 'pusi', 'phisqa', 'suxta', 'paqallqu', 'kimsaqallqu', 'llatunka'];

// Quechua: 13 = chunka kimsayuq, 17 = chunka qanchisniyuq, 20 = iskay chunka, 21 = iskay chunka hukniyuq
const quechua = (n) => {
  if (n === 1000) return 'waranqa';
  if (n === 100) return 'pachak';
  if (n < 10) return Q_UNI[n];
  const d = Math.floor(n / 10);
  const u = n % 10;
  const tens = d === 1 ? 'chunka' : `${Q_UNI[d]} chunka`;
  if (!u) return tens;
  const uni = Q_UNI[u];
  return `${tens} ${uni}${vocal(uni) ? 'yuq' : 'niyuq'}`;
};

// Aimara: 13 = tunka kimsani, 20 = pä tunka, 21 = pä tunka mayani
const aymara = (n) => {
  if (n === 1000) return 'waranqa';
  if (n === 100) return 'pataka';
  if (n < 10) return A_UNI[n];
  const d = Math.floor(n / 10);
  const u = n % 10;
  const tens = d === 1 ? 'tunka' : `${d === 2 ? 'pä' : A_UNI[d]} tunka`;
  if (!u) return tens;
  const uni = A_UNI[u];
  return `${tens} ${uni}${vocal(uni) ? 'ni' : 'ini'}`;
};

export const numeroEn = (n, idioma) => (idioma === 'aymara' ? aymara(n) : quechua(n));

// Partes del nombre del número, para pintarlas de colores en el constructor (decenas + unidades)
export const partesNumero = (n, idioma) => {
  const full = numeroEn(n, idioma);
  if (n < 11 || n === 100 || n === 1000 || n % 10 === 0) return [{ texto: full, tipo: n < 10 ? 'unidad' : 'decena' }];
  const tens = numeroEn(n - (n % 10), idioma);
  return [
    { texto: tens, tipo: 'decena' },
    { texto: full.slice(tens.length + 1), tipo: 'unidad' },
  ];
};

export const ES_NUM = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte'];
