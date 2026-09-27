import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  { url: '/', lang: 'es', other: '/en/' },
  { url: '/en/', lang: 'en', other: '/' },
] as const;

for (const p of pages) {
  test.describe(`home ${p.lang}`, () => {
    test('idioma, reino y hreflang', async ({ page }) => {
      await page.goto(p.url);
      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', p.lang);
      await expect(html).toHaveAttribute('data-realm', 'noche');
      await expect(page.locator('link[hreflang="es"]')).toHaveAttribute('href', 'https://brujartesana.com/');
      await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', 'https://brujartesana.com/en/');
      await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute('href', 'https://brujartesana.com/');
      await expect(page.getByRole('heading', { level: 1, name: 'La Bruja Artesana' })).toBeVisible();
    });

    test('el selector de idioma lleva a la página equivalente', async ({ page }) => {
      await page.goto(p.url);
      await page.locator('.site-footer .lang-switch').click();
      await expect(page).toHaveURL(p.other);
    });

    test('sin scroll horizontal', async ({ page }) => {
      await page.goto(p.url);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });

    test('los tokens del reino se resuelven', async ({ page }) => {
      await page.goto(p.url);
      const navBg = await page.locator('.site-header').evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(navBg).not.toBe('rgba(0, 0, 0, 0)');
    });

    test('sin violaciones de accesibilidad (axe, WCAG 2.2 AA)', async ({ page }) => {
      await page.goto(p.url);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
    });
  });
}

test('menú móvil se abre, se cierra con Escape y devuelve el foco', async ({ page }, info) => {
  test.skip(info.project.name === 'desktop', 'En desktop el menú está siempre visible');
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Menú' });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: 'Explora' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('404 bilingüe y sin indexar', async ({ page }) => {
  const res = await page.goto('/no-existe/');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Página no encontrada' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});
