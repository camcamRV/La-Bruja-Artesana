import { describe, expect, it } from 'vitest';
import { languages, ui } from '../../src/i18n/ui';
import { routes } from '../../src/i18n/routes';
import { alternate, getLang, path } from '../../src/i18n/utils';

describe('ui', () => {
  it('ES y EN tienen exactamente las mismas claves', () => {
    expect(Object.keys(ui.en).sort()).toEqual(Object.keys(ui.es).sort());
  });

  it('ningún texto está vacío', () => {
    for (const lang of Object.keys(languages) as (keyof typeof languages)[]) {
      for (const [key, value] of Object.entries(ui[lang])) expect(value.trim(), `${lang}.${key}`).not.toBe('');
    }
  });

  it('sin em dashes en ningún texto', () => {
    for (const dict of Object.values(ui)) for (const value of Object.values(dict)) expect(value).not.toContain('—');
  });
});

describe('routes', () => {
  const entries = Object.entries(routes);

  it('cada ruta termina en /', () => {
    for (const [, r] of entries) {
      expect(r.es.endsWith('/')).toBe(true);
      expect(r.en.endsWith('/')).toBe(true);
    }
  });

  it('español sin prefijo e inglés bajo /en/', () => {
    for (const [, r] of entries) {
      expect(r.es.startsWith('/en/')).toBe(false);
      expect(r.en.startsWith('/en/')).toBe(true);
    }
  });

  it('no hay rutas repetidas', () => {
    const all = entries.flatMap(([, r]) => [r.es, r.en]);
    expect(new Set(all).size).toBe(all.length);
  });
});

describe('utils', () => {
  it('getLang lee el idioma de la URL', () => {
    expect(getLang(new URL('https://brujartesana.com/'))).toBe('es');
    expect(getLang(new URL('https://brujartesana.com/explora/tarot/'))).toBe('es');
    expect(getLang(new URL('https://brujartesana.com/en/'))).toBe('en');
    expect(getLang(new URL('https://brujartesana.com/en/explore/'))).toBe('en');
    expect(getLang(new URL('https://brujartesana.com/entrada/'))).toBe('es');
  });

  it('path devuelve la ruta localizada', () => {
    expect(path('dailyCard', 'es')).toBe('/explora/tarot/carta-del-dia/');
    expect(path('dailyCard', 'en')).toBe('/en/explore/tarot/card-of-the-day/');
  });

  it('alternate da URLs absolutas en ambos idiomas', () => {
    expect(alternate('tarot', new URL('https://brujartesana.com'))).toEqual({
      es: 'https://brujartesana.com/explora/tarot/',
      en: 'https://brujartesana.com/en/explore/tarot/',
    });
  });
});
