import { describe, expect, it } from 'vitest';
import catalog from '../../design/ornaments.json';

describe('ornaments.json', () => {
  it('ids únicos', () => {
    const ids = [...catalog.static, ...catalog.generative].map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cada ornamento estático es un SVG decorativo en currentColor', () => {
    for (const o of catalog.static) {
      expect(o.svg.startsWith('<svg '), o.id).toBe(true);
      expect(o.svg, o.id).toContain("aria-hidden='true'");
      expect(o.svg, o.id).toContain('currentColor');
      expect(o.svg, o.id).not.toMatch(/#[0-9a-fA-F]{3,6}\b/);
    }
  });
});
