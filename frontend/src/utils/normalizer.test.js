import { describe, it, expect } from 'vitest';
import { baseNormalize, classifyAnswer } from './normalizer';

describe('baseNormalize', () => {
  it('unifica apóstrofos tipográficos, quita tildes y signos de los bordes', () => {
    expect(baseNormalize('  ¡P’unchay!  ')).toBe("p'unchay");
    expect(baseNormalize('Mamá')).toBe('mama');
  });
  it('conserva la ñ', () => {
    expect(baseNormalize('Ñaña')).toBe('ñaña');
  });
});

describe('classifyAnswer — quechua (Cusco-Collao)', () => {
  const q = (given, expected) => classifyAnswer(given, expected, 'quechua');

  it('acepta la forma estándar como correcta', () => {
    expect(q("allin p'unchay", "Allin p'unchay").resultado).toBe('correcto');
  });
  it('acepta sin glotalizada como variante', () => {
    const r = q('allin punchay', "Allin p'unchay");
    expect(r.resultado).toBe('variante');
    expect(r.fenomenos).toContain('glotalizada');
  });
  it('acepta sin aspirada como variante', () => {
    expect(q('pacha', 'phacha').resultado).toBe('variante');
  });
  it('acepta el pentavocalismo (e/o) como variante', () => {
    const r = q('qocha', 'qucha');
    expect(r.resultado).toBe('variante');
    expect(r.fenomenos).toContain('vocal');
  });
  it('acepta la alternancia q/k y grafías castellanas como variante', () => {
    expect(q('kucha', 'qucha').resultado).toBe('variante');
    expect(q('huasi', 'wasi').resultado).toBe('variante');
    expect(q('cocha', 'qucha').resultado).toBe('variante');
  });
  it('rechaza una palabra distinta', () => {
    expect(q('yaku', 'wasi').resultado).toBe('incorrecto');
    expect(q('', 'wasi').resultado).toBe('incorrecto');
  });
});

describe('classifyAnswer — aymara', () => {
  const a = (given, expected) => classifyAnswer(given, expected, 'aymara');

  it('acepta j/x/h como variante', () => {
    expect(a('hilata', 'jilata').resultado).toBe('variante');
    expect(a('xilata', 'jilata').resultado).toBe('variante');
  });
  it("acepta sin glotalizada: ch'uqi / chuqi", () => {
    expect(a('chuqi', "ch'uqi").resultado).toBe('variante');
  });
  it('rechaza una palabra distinta', () => {
    expect(a('uma', 'uta').resultado).toBe('incorrecto');
  });
});
