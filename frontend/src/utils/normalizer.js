// Normalizador dialectal por reglas: clasifica una respuesta escrita como
//   "correcto"   → igual a la esperada (sin importar mayúsculas, tildes del castellano ni signos)
//   "variante"   → igual una vez aplicadas las reglas de variación de la lengua
//                  (trivocalismo e/o → i/u, alternancia q/k, glotalizadas y aspiradas sin marcar,
//                  grafías castellanas como hu-, c-, qu-). Se acepta y se muestra la forma estándar.
//   "incorrecto" → distinta incluso con esas reglas.
// Las reglas viven en cada paquete de idioma (src/languages/*.json), así una lengua nueva trae las suyas.
import { getLanguage } from '../languages';

// Apóstrofos tipográficos → apóstrofo simple; tildes del castellano fuera (la ñ se conserva); signos de los bordes fuera
export const baseNormalize = (value) =>
  String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/(?!̃)[̀-ͯ]/g, '')
    .normalize('NFC')
    .replace(/[’‘´`ʼʻ]/g, "'")
    .replace(/^[\s¿¡.,;:!?"«»()]+|[\s¿¡.,;:!?"«»()]+$/g, '')
    .replace(/\s+/g, ' ');

// Aplica las reglas de variación en orden y anota qué fenómenos intervinieron
export const foldVariants = (value, languageId) => {
  const rules = getLanguage(languageId)?.normalizador?.reglas ?? [];
  let text = baseNormalize(value);
  const phenomena = new Set();
  for (const rule of rules) {
    const re = new RegExp(rule.patron, 'g');
    const next = text.replace(re, rule.reemplazo);
    if (next !== text) {
      phenomena.add(rule.fenomeno);
      text = next;
    }
  }
  return { text, phenomena };
};

/**
 * classifyAnswer("allin punchay", "Allin p'unchay", "quechua")
 * → { resultado: "variante", fenomenos: ["glotalizada"], estandar: "Allin p'unchay" }
 */
export const classifyAnswer = (given, expected, languageId) => {
  const a = baseNormalize(given);
  const b = baseNormalize(expected);
  if (a === b) return { resultado: 'correcto', fenomenos: [], estandar: expected };
  if (!a) return { resultado: 'incorrecto', fenomenos: [], estandar: expected };

  const foldedGiven = foldVariants(given, languageId);
  const foldedExpected = foldVariants(expected, languageId);
  if (foldedGiven.text === foldedExpected.text) {
    const fenomenos = [...new Set([...foldedGiven.phenomena, ...foldedExpected.phenomena])];
    return { resultado: 'variante', fenomenos, estandar: expected };
  }
  return { resultado: 'incorrecto', fenomenos: [], estandar: expected };
};

// Nombres legibles de cada fenómeno, para explicar la variante a la persona
export const PHENOMENON_LABELS = {
  glotalizada: "consonante glotalizada (p', t', ch', k', q')",
  aspirada: 'consonante aspirada (ph, th, chh, kh, qh)',
  vocal: 'vocales e/o, que se escriben i/u',
  uvular: 'alternancia q/k',
  grafia: 'grafía castellana (hu-, c-, qu-, j-)',
};
