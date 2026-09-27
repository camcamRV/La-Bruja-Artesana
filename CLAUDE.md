# CLAUDE.md

## Proyecto
La Bruja Artesana. Astro 7 estático, TypeScript strict, bilingüe es/en. Deploy en GitHub Pages con dominio propio `brujartesana.com`.
Repo: `camcamRV/La-Bruja-Artesana`. Plan: `PLAN.md`. Orden de trabajo: `ROADMAP.md`.
Fuente de verdad visual: `design/` (tokens, ornamentos, `STYLE-GUIDE.md`).

## Comandos
- `npm run dev`: servidor local en http://localhost:4321 (regenera `tokens.css` antes).
- `npm run check && npm test && npm run build && npm run test:e2e`: todo lo que corre CI.
- `src/styles/tokens.css` se genera desde `design/design-tokens.json`. No editarlo a mano.

## Reglas de datos (no negociables)
- NUNCA inventes significados, palabras clave, correspondencias, fuentes ni datos astronómicos.
- Puedes crear la estructura de un registro y datos factuales verificables (nombre de la carta, número, palo, carácter y transliteración de una runa).
- Todo campo interpretativo nuevo se deja vacío ("") con `status: "draft"`. Lo llena la autora.
- Las herramientas solo leen de `src/data/`. Ningún texto de resultado vive en componentes.
- Mismo `id` para el mismo registro en ambos idiomas.

## Reglas de código
- TypeScript strict. Nada de `any`.
- Textos de UI solo en `src/i18n/ui.ts`. Ningún string visible hardcodeado en componentes.
- Rutas localizadas solo vía `src/i18n/routes.ts` y `path()`. Nunca `href="/..."` a mano.
- Ningún color, tamaño ni fuente escrito a mano en componentes: solo variables de `tokens.css`.
- Cada página pone su reino en `<html data-realm>` vía `Base.astro` (`noche`, `medianoche`, `pergamino`).
- Islas en Preact. Usa `client:visible` salvo que el componente esté arriba del fold.
- Sin em dashes en ningún texto. Usa comas, puntos o paréntesis.
- Tono: tú (no usted) en español, you en inglés.
- Cartas de tarot: baraja propia dibujada en código (SVG). Nunca escaneos RWS ni imágenes generadas con IA.

## Flujo
- Una rama por issue: `feat/<issue>-<slug>`, `fix/<issue>-<slug>`.
- Commits convencionales: feat, fix, chore, docs, test, data.
- Antes de abrir PR: `npm run check && npm test && npm run build`.
- No mezcles cambios de datos (`data:`) con cambios de código en el mismo PR.

## Notas técnicas
- TypeScript 6: `@astrojs/check` aún no soporta TypeScript 7.
- `astro preview` en Astro 7 usa un lock file; Playwright lo lanza en el puerto 4329 con `--ignore-lock`.
