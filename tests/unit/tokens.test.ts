import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';

let css = '';

beforeAll(() => {
  // Falla si algún alias no resuelve (build-tokens lanza "Alias roto").
  execFileSync('npx', ['tsx', 'scripts/build-tokens.ts'], { stdio: 'pipe' });
  css = readFileSync('src/styles/tokens.css', 'utf8');
});

describe('tokens.css', () => {
  it('no quedan alias sin resolver ni valores vacíos', () => {
    expect(css).not.toMatch(/\{[a-z]+\.[a-zA-Z0-9.]+\}/);
    expect(css).not.toMatch(/:\s*(undefined|\[object Object\])?;/);
  });

  it('define los tres reinos', () => {
    for (const realm of ['noche', 'medianoche', 'pergamino']) expect(css).toContain(`[data-realm="${realm}"]`);
  });

  it('los tokens que dependen del reino no están en :root', () => {
    const root = css.slice(css.indexOf(':root {'), css.indexOf('}', css.indexOf(':root {')));
    expect(root).not.toContain('var(--realm-');
    for (const token of ['--gradient-nebula', '--component-plate-bg', '--component-input-bg', '--component-nav-bg']) {
      expect(root).not.toContain(`${token}:`);
      expect(css).toContain(`${token}:`);
    }
  });

  it('la impresión fuerza pergamino', () => {
    const print = css.slice(css.indexOf('@media print'));
    expect(print).toContain('color-scheme: light');
    expect(print).toContain('--realm-bg: #F3EBDA');
  });
});
