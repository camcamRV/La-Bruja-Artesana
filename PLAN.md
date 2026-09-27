# La Bruja Artesana · Plan de construcción para Claude Code

Sitio bilingüe (ES/EN) de herramientas esotéricas, biblioteca y obras, construido con Astro y versionado en GitHub.
Español es el idioma por defecto en `/`. Inglés vive en `/en/`.

V1 es 100% estático (GitHub Pages) e incluye las 12 herramientas, calculadas en el navegador. Cuentas, pagos y PDFs en servidor quedan fuera de V1.

---

## 0. Reglas para Claude Code (copiar a `CLAUDE.md`)

```md
# CLAUDE.md

## Proyecto
La Bruja Artesana. Astro estático, TypeScript strict, bilingüe es/en. Deploy en GitHub Pages con dominio propio `brujartesana.com`.
Repo: `camcamRV/La-Bruja-Artesana`. Fuente de verdad visual: `design/` (tokens, ornamentos, STYLE-GUIDE.md).

## Reglas de datos (no negociables)
- NUNCA inventes significados, palabras clave, correspondencias, fuentes ni datos astronómicos.
- Puedes crear la estructura de un registro y datos factuales verificables (nombre de la carta, número, palo, carácter y transliteración de una runa).
- Todo campo interpretativo nuevo se deja vacío ("") con `status: "draft"`. Lo llena la autora.
- Las herramientas solo leen de `src/data/`. Ningún texto de resultado vive en componentes.
- Mismo `id` para el mismo registro en ambos idiomas.

## Reglas de código
- TypeScript strict. Nada de `any`.
- Textos de UI solo en `src/i18n/ui.ts`. Ningún string visible hardcodeado en componentes.
- Rutas localizadas solo vía `src/i18n/routes.ts`.
- Islas en Preact. Usa `client:visible` salvo que el componente esté arriba del fold.
- Ningún color, tamaño ni fuente escrito a mano en componentes: solo variables de `tokens.css` (generado desde `design/`).
- Sin em dashes en ningún texto. Usa comas, puntos o paréntesis.
- Tono: tú (no usted) en español, you en inglés.

## Flujo
- Una rama por issue: `feat/<issue>-<slug>`, `fix/<issue>-<slug>`.
- Commits convencionales: feat, fix, chore, docs, test, data.
- Antes de abrir PR: `npm run check && npm test && npm run build`.
- No mezcles cambios de datos (`data:`) con cambios de código en el mismo PR.
```

---

## 1. Stack

| Pieza | Uso |
|---|---|
| Astro (`output: 'static'`) | Páginas, i18n, content collections, islas |
| Preact (`@astrojs/preact`) | Islas de las herramientas (bundle pequeño) |
| Zod (vía `astro/zod`) | Validación de datasets y contenido |
| `@astrojs/sitemap` | Sitemap con alternates por idioma |
| Pagefind | Búsqueda estática en la Biblioteca, un índice por idioma |
| `astronomy-engine` (MIT) | Luna, carta natal, mapa estelar, astrocartografía |
| `d3-geo` | Proyecciones del mapa estelar y del mapa mundial |
| GeoNames `cities15000` (CC BY 4.0) | Ciudades con coordenadas y zona horaria, sin API |
| Yale Bright Star Catalogue, datos de d3-celestial (BSD-3), Natural Earth | Estrellas, constelaciones IAU, mapa mundial |
| Vitest | Pruebas de datos, aleatoriedad y cálculos |
| Playwright | E2E en ambos idiomas y en 320 px / 768 px / desktop |
| GitHub | Repo, Issues, Projects, Actions (CI), Pages (deploy) |

---

## 2. Estructura

```
src/
  pages/
    index.astro
    explora/index.astro
    explora/tarot/index.astro
    explora/tarot/carta-del-dia.astro
    explora/runas/index.astro
    explora/astrologia/luna.astro
    lecturas.astro
    biblioteca/index.astro
    biblioteca/[categoria]/[slug].astro
    biblioteca/glosario.astro
    obras/index.astro
    obras/grimorio.astro
    obras/libro-de-sombras.astro
    explora/astrologia/{carta-natal,astrocartografia}.astro
    explora/tu-esencia.astro
    explora/magia/{correspondencias,rituales,sigilos,shadow-work}.astro
    explora/cielo.astro
    sobre.astro  preguntas.astro  contacto.astro  404.astro
    en/                      # espejo con slugs en inglés
  components/
    layout/  Base.astro, Header.astro, Footer.astro, LangSwitcher.astro, Seo.astro
    ui/      Button, Plate, Badge, ArchHero, PaperNote, Divider, Field, BookShelf
    ornaments/ Ornament, MoonPhase, Astrolabe, StarField, Constellation,
             TarotCard, TarotBack, SuitSymbol   # ver design/ornaments.json
    tools/   TarotDraw, DailyCard, RuneDraw, BirthChart, Essence, MoonCalendar,
             Correspondences, RitualWizard, SigilGenerator, ShadowWork, SkyMap, Astrocarto
    shared/  ToolResult, PlacePicker, BirthDataForm, ShareCard
  views/                     # contenido real de cada página, recibe `lang`
    HomeView.astro, TarotView.astro, ...
  content/
    library/es/*.mdx
    library/en/*.mdx
  data/
    tarot/rws.json
    runes/elder-futhark.json
    tarot/spreads.json
    moon/                    # generado en build
    astro/aspects.json  astro/interpretations.json  astro/astrocarto-interpretations.json
    essence/quiz.json  essence/rules.json  essence/archetypes.json
    correspondences.json  plants.json  forbidden-terms.json
    rituals/blocks.json  rituals/safety.json
    shadow/prompts.json
    constellations.json
    readings.json            # paquetes y precios
    versions.json            # versión actual de cada dataset
  i18n/
    ui.ts  routes.ts  utils.ts
  lib/
    random.ts  daily.ts  datasets.ts  share.ts
    astro/   time.ts  ephemeris.ts  houses.ts  aspects.ts  moon.ts  sky.ts  astrocarto.ts
    rules/   essence.ts  correspondences.ts  rituals.ts
    sigil/   normalize.ts  reduce.ts  draw.ts
  styles/
    tokens.css               # generado por scripts/build-tokens.ts, no editar
    global.css  print.css
  content.config.ts
design/                      # fuente de verdad visual (ver design/STYLE-GUIDE.md)
  design-tokens.json  ornaments.json  STYLE-GUIDE.md  BA_LOGO.svg
scripts/
  build-tokens.ts            # design-tokens.json → src/styles/tokens.css (predev, prebuild)
  check-datasets.ts          # falla en release si hay drafts
  build-moon.ts              # precalcula fases lunares
  build-geo.ts               # ciudades por país desde GeoNames
  build-sky.ts               # estrellas y constelaciones compactadas
docs/
  sigil-algorithm.md  astro-methodology.md
public/
  CNAME                      # brujartesana.com
  data/geo/{CC}.json  data/sky/*.json
tests/
  unit/  e2e/
.github/
  workflows/ci.yml  workflows/deploy.yml
  ISSUE_TEMPLATE/  pull_request_template.md
```

Patrón clave: cada página en `pages/` y `pages/en/` es un envoltorio de 3 líneas que renderiza su `View` con el idioma. La lógica existe una sola vez.

```astro
---
// src/pages/en/explore/tarot/index.astro
import TarotView from '../../../../views/TarotView.astro';
---
<TarotView lang="en" />
```

---

## 3. Fase 0 · Repo y GitHub

- [x] Crear repo `camcamRV/La-Bruja-Artesana` (público, para Pages gratis).
- [ ] Rama `main` protegida (PR obligatorio, CI verde obligatorio).
- [ ] Labels: `fase-0`...`fase-7`, `data`, `i18n`, `tool`, `content`, `bug`, `bloqueado-autora`.
- [ ] Issue templates: Feature, Bug, Dataset (campos: dataset, registros, fuente, revisado por).
- [ ] PR template con checklist: probado en ES, probado en EN, 320 px, sin strings hardcodeados, sin em dashes.
- [ ] GitHub Project (board) con columnas: Backlog, Listo, En curso, Revisión, Hecho.
- [ ] Un issue por cada checkbox de este plan.

---

## 4. Fase 1 · Fundaciones

### 4.1 Configuración

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://brujartesana.com',
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    preact(),
    sitemap({ i18n: { defaultLocale: 'es', locales: { es: 'es', en: 'en' } } }),
  ],
});
```

Dominio propio desde el inicio, así que no hay `base`. Aun así, todos los enlaces internos pasan por `path(routeId, lang)`, que antepone `import.meta.env.BASE_URL` (hoy `/`). Nunca escribir `href="/..."` a mano: así el sitio sigue funcionando si algún día se sirve bajo una subruta.

Dominio: `public/CNAME` con `brujartesana.com`. En el registrador: registros `A` del dominio raíz a las IPs de GitHub Pages (185.199.108.153, .109, .110, .111), `AAAA` opcionales, y `www` como `CNAME` a `camcamrv.github.io`. En Settings > Pages del repo: dominio personalizado y "Enforce HTTPS". Verificar el dominio en la configuración de la cuenta de GitHub para evitar que otro repo lo tome.

### 4.2 i18n

```ts
// src/i18n/ui.ts
export const languages = { es: 'Español', en: 'English' } as const;
export type Lang = keyof typeof languages;

export const ui = {
  es: {
    'nav.explore': 'Explora',
    'nav.readings': 'Lecturas',
    'nav.library': 'La Biblioteca Oculta',
    'nav.works': 'Obras',
    'tool.draw': 'Sacar carta',
    'tool.version': 'Dataset',
  },
  en: {
    'nav.explore': 'Explore',
    'nav.readings': 'Readings',
    'nav.library': 'La Biblioteca Oculta',
    'nav.works': 'Works',
    'tool.draw': 'Draw a card',
    'tool.version': 'Dataset',
  },
} satisfies Record<Lang, Record<string, string>>;
// Test: ambas lenguas tienen exactamente las mismas claves.
```

```ts
// src/i18n/routes.ts
export const routes = {
  home:        { es: '/',                            en: '/en/' },
  explore:     { es: '/explora/',                    en: '/en/explore/' },
  tarot:       { es: '/explora/tarot/',              en: '/en/explore/tarot/' },
  dailyCard:   { es: '/explora/tarot/carta-del-dia/', en: '/en/explore/tarot/card-of-the-day/' },
  runes:       { es: '/explora/runas/',              en: '/en/explore/runes/' },
  moon:        { es: '/explora/astrologia/luna/',    en: '/en/explore/astrology/moon/' },
  readings:    { es: '/lecturas/',                   en: '/en/readings/' },
  library:     { es: '/biblioteca/',                 en: '/en/library/' },
  works:       { es: '/obras/',                      en: '/en/works/' },
  grimoire:    { es: '/obras/grimorio/',             en: '/en/works/grimoire/' },
  shadows:     { es: '/obras/libro-de-sombras/',     en: '/en/works/book-of-shadows/' },
  about:       { es: '/sobre/',                      en: '/en/about/' },
  faq:         { es: '/preguntas/',                  en: '/en/faq/' },
  contact:     { es: '/contacto/',                   en: '/en/contact/' },
} as const;
export type RouteId = keyof typeof routes;
```

`utils.ts` expone: `getLang(url)`, `t(lang)`, `path(routeId, lang)` (con `BASE_URL`) y `alternate(routeId)` para hreflang.

### 4.3 Layout

- [ ] `Base.astro`: `<html lang>`, meta viewport, `Seo.astro`, header, footer, slot.
- [ ] `Seo.astro`: title, description, canonical, `hreflang` es/en/x-default, Open Graph por idioma.
- [ ] `LangSwitcher.astro`: recibe `routeId` y enlaza a la página equivalente, nunca al home. En artículos usa `translationKey`; si no hay par, no muestra el enlace.
- [ ] Sin redirección automática por idioma.

### 4.4 Diseño

- [ ] `scripts/build-tokens.ts` (código en `design/STYLE-GUIDE.md` 11.2) genera `tokens.css` desde `design/design-tokens.json`. Corre en `predev` y `prebuild`.
- [ ] Reinos en lugar de tema claro/oscuro del sistema: `data-realm` (`noche`, `medianoche`, `pergamino`) en `<html>`, elegido por página; `Base.astro` recibe `realm` como prop. No se usa `prefers-color-scheme`: el reino es parte del contenido (ver STYLE-GUIDE 2).
- [ ] Impresión: `tokens.css` ya fuerza pergamino en `@media print`; `print.css` oculta nav y ornamentos grandes.
- [ ] Fuentes self-hosted con `@fontsource` (sin CDNs externos), `font-display: swap`, solo los subsets de STYLE-GUIDE 4.1 (incluye `symbols` y `runic`).
- [ ] Logotipo: `design/BA_LOGO.svg` en `currentColor`; en la nav, versión compacta en Cinzel.
- [ ] Contraste AA verificado en ambos temas.
- [ ] Componentes base en `components/ui/` y ornamentos en `components/ornaments/` (STYLE-GUIDE 7 y 11).
- [ ] Responsive desde 320 px.

### 4.5 CI

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
  push:
    branches: [main]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run check      # astro check
      - run: npm test           # vitest
      - run: npm run build
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
```

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: RELEASE=true npx tsx scripts/check-datasets.ts
      - uses: withastro/action@v3
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Verificar la última versión de las actions al crear los archivos.

---

## 5. Fase 2 · Datos

### 5.1 Esquemas

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const l10n = z.object({ es: z.string(), en: z.string() });
const l10nList = z.object({ es: z.array(z.string()), en: z.array(z.string()) });
const status = z.enum(['draft', 'reviewed']);
const source = z.object({
  citation: z.string(),
  url: z.string().url().optional(),
  kind: z.enum(['historical', 'linguistic', 'astronomical', 'botanical', 'esoteric', 'editorial']),
});
const meta = {
  version: z.string(),
  status: z.object({ es: status, en: status }),
  sources: z.array(source),
  notes: z.string().optional(),
};

const tarot = defineCollection({
  loader: file('src/data/tarot/rws.json'),
  schema: z.object({
    id: z.string(),                       // "major-00", "cups-07"
    deck: z.literal('rws'),             // tradición interpretativa; el arte es propio (TarotCard)
    arcana: z.enum(['major', 'minor']),
    suit: z.enum(['wands', 'cups', 'swords', 'pentacles']).nullable(),
    number: z.number().int().min(0).max(21),
    name: l10n,
    keywords: l10nList,
    upright: l10n,
    reversed: l10n,
    reflection: l10n,                     // pregunta de vuelta al usuario
    ...meta,
  }),
});

const runes = defineCollection({
  loader: file('src/data/runes/elder-futhark.json'),
  schema: z.object({
    id: z.string(),                       // "fehu"
    system: z.literal('elder-futhark'),
    order: z.number().int().min(1).max(24),
    aett: z.number().int().min(1).max(3),
    name: z.string(),                     // reconstrucción protogermánica, no se traduce
    character: z.string().length(1),
    transliteration: z.string(),
    historical: l10n,                     // capa de hecho
    meaning: l10n,                        // capa interpretativa
    keywords: l10nList,
    reversed: l10n.optional(),
    reversedIsModern: z.literal(true).optional(),
    reflection: l10n,
    ...meta,
  }),
});

const library = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/library' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang: z.enum(['es', 'en']),
    category: z.enum(['tarot', 'runas', 'luna', 'astrologia', 'plantas', 'simbolos', 'practica']),
    translationKey: z.string(),
    kind: z.enum(['editorial', 'public-knowledge', 'external-reference']),
    sources: z.array(source),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { tarot, runes, library };
```

### 5.2 Tareas

- [ ] `rws.json` con los 78 registros: ids, arcana, palo, número, nombres es/en (factuales). Campos interpretativos vacíos, `status: draft`.
- [ ] `elder-futhark.json` con las 24 runas: orden, aett, nombre, carácter, transliteración. Interpretación vacía, `status: draft`.
- [ ] `versions.json`: `{ "tarot": "1.0.0", "runes": "1.0.0" }`.
- [ ] Versionado semver: `patch` = redacción, `minor` = nuevos campos o registros, `major` = cambio de significado. Tag de Git por release de datos: `data-tarot@1.0.0`.
- [ ] `scripts/check-datasets.ts`: con `RELEASE=true` falla si una herramienta publicada usa registros `draft`.
- [ ] Esquemas Zod para el resto de datasets de la sección 8 (spreads, aspects, interpretations, essence, correspondences, plants, rituals, shadow, constellations).
- [ ] `check-datasets.ts` también valida `forbidden-terms.json`, plantas sin `safetyNotes` y correspondencias sin tradición.
- [ ] Issue `bloqueado-autora` por dataset para que la autora llene significados y fuentes.

### 5.3 Pruebas

- [ ] Tarot: 78 ids únicos, 22 mayores, 56 menores, 14 por palo.
- [ ] Runas: 24 ids únicos, orden 1 a 24 sin huecos, 8 por aett.
- [ ] Todo registro `reviewed` tiene es y en no vacíos y al menos una fuente.

---

## 6. Fase 3 · Páginas core

Cada una con su `View` compartida y copy en `ui.ts` o en MDX.

- [ ] Inicio: hero, herramienta destacada (Carta del Día), accesos rápidos, lecturas, Biblioteca, obras, FAQ corta.
- [ ] Explora: hub con las 12 herramientas agrupadas (Tarot, Runas, Astrología, Magia, Cielo). Las que aún esperan datos aparecen como "Próximamente".
- [ ] Lecturas: paquetes desde `readings.json` (La Consulta, La Lectura, El Grimorio Personal, Lectura de Ciclo). La Lectura destacada visualmente. CTA a contacto hasta que exista checkout.
- [ ] Obras: Grimorio y Libro de Sombras con descripción, índice/muestra y CTA (lista de espera por ahora).
- [ ] Sobre: historia, autora, filosofía, significado de "Artesana" (glosa en inglés).
- [ ] FAQ con `FAQPage` en JSON-LD.
- [ ] Contacto: `mailto:` y enlace a WhatsApp.
- [ ] Legal: aviso de práctica simbólica, privacidad, términos.
- [ ] 404 en ambos idiomas.

---

## 7. Herramientas · base común

Las 12 herramientas corren en el navegador. Ningún dato del usuario (pregunta, fecha de nacimiento, intención, diario) sale del dispositivo.

### 7.1 Aleatoriedad

```ts
// src/lib/random.ts
export function randomInt(max: number): number {
  // rejection sampling, sin sesgo de módulo
  const limit = Math.floor(0x1_0000_0000 / max) * max;
  const buf = new Uint32Array(1);
  let x: number;
  do { crypto.getRandomValues(buf); x = buf[0]; } while (x >= limit);
  return x % max;
}

export function shuffle<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function draw<T>(items: readonly T[], n: number): T[] {
  if (n > items.length) throw new Error('Spread larger than deck');
  return shuffle(items).slice(0, n);          // sin repetición
}

export const coin = () => randomInt(2) === 1;  // invertida sí/no

// PRNG con semilla para resultados reproducibles (rituales, variantes)
export function seeded(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

```ts
// src/lib/daily.ts
export const PRODUCT_TZ = 'America/Bogota';   // decisión de producto, se muestra en la UI

export function todayIn(tz = PRODUCT_TZ, d = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

export async function dailyIndex(date: string, salt: string, size: number): Promise<number> {
  const data = new TextEncoder().encode(`${salt}:${date}`);
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', data));
  return new DataView(hash.buffer).getUint32(0) % size;
}
```

### 7.2 Tiempo y lugar (carta natal, mapa estelar, astrocartografía)

- **Ciudades:** GeoNames `cities15000` (CC BY 4.0, atribución en el footer), dividido por país en `public/data/geo/{CC}.json` con `name, asciiname, admin1, lat, lon, tz`. Se carga bajo demanda al elegir país. Autocompletar sobre `asciiname` sin acentos. Script `scripts/build-geo.ts` lo genera.
- **Hora local a UTC:** `zonedToUtc(fields, tz)` en `src/lib/astro/time.ts`, iterando el offset con `Intl.DateTimeFormat` (usa la base IANA del navegador, con historia de horario de verano).
  - Hora inexistente (salto de primavera): marcar y pedir confirmación.
  - Hora ambigua (retroceso de otoño): mostrar ambas opciones.
  - Antes de 1970 los datos IANA son menos confiables en algunos países: mostrar aviso. Antes de la adopción de hora estándar del país: usar hora media local (LMT) y avisar.
- **Precisión de hora:** `exacta | aproximada | desconocida`, guardada en el resultado y visible.
- **Motor:** `astronomy-engine` (MIT). Zodíaco tropical, geocéntrico, posiciones aparentes de la fecha. Precisión esperada en torno a 1 minuto de arco.

### 7.3 Componentes compartidos

- **`ToolResult.tsx`:** resultado, badge de tradición o fuente, versión del dataset en letra pequeña, reflexión (pregunta de vuelta), guardar, compartir, siguiente paso.
- **`PlacePicker.tsx`**, **`BirthDataForm.tsx`:** reutilizados por carta natal, mapa estelar y astrocartografía. Recuerdan datos en `localStorage` solo si el usuario marca "recordar en este dispositivo".
- **Guardar:** `localStorage` con `{ tool, ids, params, version, date }`, nunca texto interpretativo. Se re-renderiza desde el dataset en el idioma actual.
- **Compartir:** imagen en `<canvas>` + Web Share API con fallback a descarga. Parámetros no sensibles en la URL (`?i=proteccion`) para herramientas que lo permiten.
- **PDF en V1:** hoja de estilos `print.css` por herramienta y botón "Guardar como PDF" (`window.print()`). El pie impreso incluye fecha, idioma y versión del dataset.
- **Accesibilidad:** resultados con `aria-live="polite"`, foco gestionado, operable con teclado, `prefers-reduced-motion` respetado, gráficos SVG con `<title>` y tabla alternativa.

### 7.4 Rutas nuevas

Agregar a `routes.ts`:

| routeId | ES | EN |
|---|---|---|
| `birthChart` | `/explora/astrologia/carta-natal/` | `/en/explore/astrology/birth-chart/` |
| `astrocarto` | `/explora/astrologia/astrocartografia/` | `/en/explore/astrology/astrocartography/` |
| `essence` | `/explora/tu-esencia/` | `/en/explore/your-essence/` |
| `correspondences` | `/explora/magia/correspondencias/` | `/en/explore/magic/correspondences/` |
| `rituals` | `/explora/magia/rituales/` | `/en/explore/magic/rituals/` |
| `sigils` | `/explora/magia/sigilos/` | `/en/explore/magic/sigils/` |
| `shadowWork` | `/explora/magia/shadow-work/` | `/en/explore/magic/shadow-work/` |
| `sky` | `/explora/cielo/` | `/en/explore/sky/` |

---

## 8. Especificación de las 12 herramientas

Formato por herramienta: entradas, datos, motor, salida, reglas, pruebas.

### 8.1 Pregunta al Tarot

- **Entradas:** pregunta (opcional, nunca se guarda ni se envía), tirada, invertidas sí/no.
- **Datos:** `tarot/rws.json` (78) + `tarot/spreads.json` (`id, name, positions[{ id, label: l10n, meaning: l10n }]`). V1: 1 carta, 3 cartas (pasado/presente/futuro), 3 cartas (situación/obstáculo/consejo). Nuevas tiradas se agregan solo en datos.
- **Motor:** `draw(deck, spread.positions.length)` + `coin()` por carta si hay invertidas.
- **Salida:** carta por posición, significado normal o invertido, palabras clave, reflexión de la autora. CTA: La Lectura.
- **Pruebas:** 10.000 tiradas sin repetición interna; toda posición de toda tirada tiene etiqueta es/en.

### 8.2 Carta del Día

- **Motor:** `dailyIndex(todayIn(), 'tarot-daily', 78)`. Sin invertidas (decisión editorial, documentada).
- **Salida:** carta (dibujada por `TarotCard` desde su `id`), palabras clave, significado, reflexión. Muestra fecha y zona horaria usada. Tarjeta compartible.
- **Reglas:** misma carta en ES y EN el mismo día.
- **Pruebas:** determinismo; cambio de día exacto a medianoche de Bogotá probado desde Madrid y Tokio.

### 8.3 Runas (del día y pregunta)

- **Datos:** `runes/elder-futhark.json` (24).
- **Motor:** runa del día con salt `runes-daily`; tirada de 1 o 3 con `draw`. Invertidas opcionales, solo para runas con `reversed` definido (las simétricas no tienen invertida).
- **Salida:** carácter, nombre, transliteración, contexto histórico (bloque de hecho) separado del significado adivinatorio (bloque interpretativo). Badge "convención moderna" en invertidas. CTA: La Consulta.
- **Pruebas:** 24 ids; ninguna runa sin `reversed` sale invertida.

### 8.4 Carta Natal

- **Entradas:** fecha, hora + precisión, país y ciudad (7.2), sistema de casas (Placidus por defecto, Signos Enteros opcional).
- **Motor** (`src/lib/astro/`):
  - Sol a Plutón y Luna: longitud eclíptica aparente de la fecha con `astronomy-engine`.
  - Nodo lunar: nodo medio (fórmula de Meeus), etiquetado como medio.
  - Ascendente y MC desde el tiempo sidéreo local (RAMC), la oblicuidad (ε) y la latitud (φ):
    - `MC = atan2(sin RAMC, cos RAMC · cos ε)`
    - `ASC = atan2(cos RAMC, −(sin RAMC · cos ε + tan φ · sin ε))`
  - Casas Placidus por iteración; por encima de ~66° de latitud no está definido: pasar a Signos Enteros con aviso.
  - Aspectos: conjunción, oposición, trígono, cuadratura, sextil. Orbes en `astro/aspects.json` (decisión editorial).
  - Conteo de elementos y modalidades.
- **Hora desconocida:** calcular a mediodía local; no mostrar Ascendente, MC ni casas. Si la Luna cambia de signo ese día, mostrar ambos signos posibles.
- **Datos interpretativos:** `astro/interpretations.json` (planeta en signo, planeta en casa, ascendente), escritos por la autora.
- **Salida:** rueda SVG, tabla de posiciones (signo, grado, minuto, casa), aspectos, elementos y modalidades, bloque de metodología (zodíaco, sistema de casas, zona horaria resuelta, UTC usado). Resumen gratuito; CTA a lectura de carta natal.
- **Pruebas:** 10 cartas de referencia contrastadas con un motor reconocido. Tolerancia: planetas 2', ASC y MC 3', cúspides 5'. Casos de horario de verano, hemisferio sur, latitud alta y nacimiento antes de 1970.

### 8.5 Tu Esencia

- **Entradas:** quiz de 8 a 12 preguntas + fecha de nacimiento opcional.
- **Datos:** `essence/quiz.json` (pregunta, respuestas, puntos por arquetipo), `essence/rules.json` (reglas con `id`, condición, resultado, fuente o etiqueta editorial), `essence/archetypes.json` (textos de la autora).
- **Motor:** suma de puntos por arquetipo; desempate por orden fijo documentado. Con fecha: signo solar calculado con `astronomy-engine` (días de cúspide marcados), elemento del signo y arcano de nacimiento con el método de reducción definido en `rules.json` (declarado como método numerológico, no histórico).
- **Reglas:** cada conexión mostrada existe como regla explícita. Sin regla, no se muestra. Aviso: experiencia simbólica, no diagnóstico psicológico.
- **Salida:** arquetipo, elemento, arcano, texto, bloque "por qué este resultado" con las reglas aplicadas. CTA personalizado por arquetipo.
- **Pruebas:** todas las combinaciones de respuestas producen un resultado; cada resultado lista al menos una regla.

### 8.6 Calendario lunar

- **Motor:** `scripts/build-moon.ts` precalcula en build, para 3 años: cuartos exactos (UTC), iluminación diaria y signo lunar diario con el mismo motor de la carta natal. Salida a `src/data/moon/`.
- **Salida:** vista mensual + ficha de la fase actual (fase, iluminación, próxima fase con fecha y hora local, signo lunar). Bloque astronómico separado del bloque interpretativo (`moon/phases-meaning.json`).
- **Mantenimiento:** workflow mensual en Actions que regenera y amplía el rango.
- **Pruebas:** 10 fases contrastadas con efemérides publicadas, tolerancia de 2 minutos.

### 8.7 Correspondencias

- **Entradas:** intención (protección, amor, prosperidad, claridad, calma, transformación, limpieza), filtros por tipo y tradición.
- **Datos:**
  - `correspondences.json`: `id, intention, itemType (planta | color | piedra | dia | fase | simbolo | elemento), itemRef, tradition, source?, editorialStatus (sourced | editorial), text: l10n`.
  - `plants.json`: `id, botanicalName, commonName: l10n, botanicalFacts: l10n, safetyNotes: l10n (obligatorio), toxic: boolean`.
- **Reglas:** solo registros con fuente o etiqueta editorial explícita. Plantas siempre con nota de seguridad visible; tóxicas con aviso destacado. Sin usos medicinales.
- **Salida:** resultados agrupados por tipo, badge de tradición. Guardar y compartir por URL. CTA: guía de correspondencias.
- **Pruebas:** `check-datasets` falla con registros sin tradición, plantas sin `safetyNotes`, o textos con palabras de `forbidden-terms.json` (curar, tratar, dosis, ingerir / cure, treat, dose, ingest...).

### 8.8 Generador de rituales

- **Wizard:** intención → momento (fase lunar actual o próxima desde 8.6, día de la semana) → elementos disponibles (checklist) → duración (corta, media).
- **Datos:** `rituals/blocks.json`: `id, slot (apertura | intencion | accion | cierre), intentions[], requires[], duration, riskTags[] (fuego | planta | agua-exterior), text: l10n`. `rituals/safety.json`: un bloque por `riskTag`.
- **Motor:** un bloque por slot que cumpla intención, elementos y duración, elegido con `seeded(seed)`. "Generar variante" cambia la semilla. Si un slot no tiene bloques válidos, mostrar estado vacío con sugerencia, nunca inventar.
- **Reglas:** bloque de seguridad insertado automáticamente por cada `riskTag` presente. Sin instrucciones de daño, ingestión, prácticas médicas ni sustancias peligrosas (revisión editorial + `forbidden-terms.json`).
- **Salida:** ritual ensamblado, momento sugerido, lista de elementos, PDF vía impresión. Semilla en la URL para reproducirlo.
- **Pruebas:** toda combinación intención × momento × elementos mínimos da ritual o estado vacío; todo `riskTag` trae su bloque de seguridad; misma semilla, mismo ritual.

### 8.9 Generador de sigilos

- **Algoritmo** (documentado en `docs/sigil-algorithm.md` antes de programar):
  1. Normalizar: minúsculas, quitar acentos (NFD), ñ → n, solo a-z.
  2. Reducción de letras: eliminar vocales y letras repetidas (método popularizado por Austin Osman Spare).
  3. Trazado propio: 26 puntos en una rueda; cada letra restante es un punto; se unen en orden con curvas suaves.
  4. Marcas: círculo en el inicio, barra en el final.
  5. Estilos (grosor, simetría espejo) como parámetros que no cambian el trazado base.
- **Reglas:** la reducción se atribuye a Spare; la rueda y el estilo se declaran creación de La Bruja Artesana, sin atribución histórica.
- **Salida:** SVG y PNG descargables. La intención nunca sale del navegador ni se guarda.
- **Pruebas:** snapshot de SVG para entradas fijas; acentos y ñ; texto que queda vacío tras la reducción muestra mensaje.

### 8.10 Shadow Work

- **Datos:** `shadow/prompts.json`: `id, category (identidad | relaciones | limites | miedo | cambio | proposito | emociones), depth (suave | media | profunda), prompt: l10n, followUp: l10n`. Escritos por la autora en cada idioma, no traducidos línea a línea.
- **Motor:** aleatorio por categoría y profundidad, sin repetir en la sesión.
- **Salida:** pregunta, seguimiento, área de escritura guardada solo en `localStorage`, exportar `.md`, borrar todo. Nota fija y cálida: si algo remueve demasiado, hablar con alguien de confianza o un profesional.
- **Reglas:** sin lenguaje clínico ni diagnósticos (`forbidden-terms.json`).
- **Pruebas:** al menos 5 preguntas por categoría y profundidad antes de publicar; sin repeticiones en 20 extracciones seguidas.

### 8.11 Mapa estelar

- **Entradas:** fecha, hora y lugar (7.2).
- **Datos** (en `public/data/sky/`, cargados bajo demanda):
  - Estrellas hasta magnitud 6 (Yale Bright Star Catalogue, ~9.100) en JSON compacto: RA/Dec J2000, magnitud, color B-V.
  - Líneas y límites de las 88 constelaciones IAU y nombres: datos de d3-celestial (BSD-3).
  - Nombres propios de estrellas: lista IAU WGSN.
  - `constellations.json`: nombre IAU (latín) + es/en, datos astronómicos, mitología por tradición con fuentes.
- **Motor:** precesión de J2000 a la fecha y conversión a altitud/acimut con `astronomy-engine`; planetas y Luna incluidos. Proyección estereográfica con `d3-geo`, render en SVG.
- **Salida:** cielo visible, constelaciones etiquetadas, clic en estrella o constelación abre ficha con bloque astronómico y bloque de simbolismo separados. Descarga SVG y PNG.
- **Pruebas:** altitud de Polaris aproximadamente igual a la latitud; 5 estrellas contrastadas con referencia, tolerancia 0,1°.

### 8.12 Astrocartografía

- **Requisito:** carta natal con hora exacta. Con hora aproximada o desconocida, la herramienta no dibuja líneas y explica por qué.
- **Motor** (`src/lib/astro/astrocarto.ts`), con AR y declinación aparentes de cada planeta y el tiempo sidéreo de Greenwich (GAST), longitudes al este positivas:
  - MC: `λ = AR − GAST`; IC: `λ + 180°`.
  - ASC y DSC por latitud φ, donde `|tan φ · tan δ| ≤ 1`: `H₀ = acos(−tan φ · tan δ)`; ascendente `λ = AR − H₀ − GAST`; descendente `λ = AR + H₀ − GAST`.
  - Muestreo cada 0,5° de latitud, normalizado a −180°..180°.
- **Mapa:** Natural Earth 1:110m (dominio público) con `d3-geo`, líneas por planeta, activar o desactivar planetas, leyenda.
- **Datos interpretativos:** `astro/astrocarto-interpretations.json` (planeta × ángulo), de la autora.
- **Salida:** mapa, bloque de metodología (geocéntrico, en mundo, sin parans en V1), aviso de interpretación astrológica. CTA: lectura.
- **Pruebas:** líneas MC de una carta de referencia contrastadas con un motor reconocido, tolerancia 0,5°; ASC y DSC simétricas respecto al MC en el ecuador.

---

## 9. Funnel por herramienta

| Herramienta | Siguiente paso |
|---|---|
| Pregunta al Tarot | La Lectura |
| Carta del Día | Guía de Tarot (Biblioteca) |
| Runas | La Consulta con runas |
| Carta Natal | Lectura de carta natal |
| Tu Esencia | Lectura o recurso según arquetipo |
| Calendario lunar | Diario de la Luna (descarga) |
| Correspondencias | Guía de símbolos y correspondencias |
| Rituales | Diario de Intenciones |
| Sigilos | Diario de Intenciones |
| Shadow Work | Cuaderno de Autoconocimiento |
| Mapa estelar | Artículos de constelaciones |
| Astrocartografía | Lectura de carta natal |

---

## 10. Orden de construcción

| Fase | Herramientas | Depende de |
|---|---|---|
| Fase 4 · Aleatorias | Tarot, Carta del Día, Runas, Shadow Work | 7.1, 7.3, datasets de la autora |
| Fase 5 · Motor astronómico | `time.ts`, geo, Calendario lunar, Carta Natal, Mapa estelar, Astrocartografía | 7.2, casos de referencia |
| Fase 6 · Simbólicas | Correspondencias, Rituales, Sigilos, Tu Esencia | `seeded`, reglas y bloques de la autora, fases lunares |
| Fase 7 · Biblioteca y SEO | Biblioteca Oculta, glosario, descargables, Pagefind, JSON-LD, OG | contenido |

### Fase 7 · Biblioteca Oculta y SEO

- [ ] Rutas `biblioteca/[categoria]/[slug]` y `en/library/[category]/[slug]` con `getStaticPaths` filtrando por `lang`.
- [ ] Mapa de categorías es/en para los slugs.
- [ ] Badge de tipo: editorial, conocimiento público o referencia externa. Fuentes al final.
- [ ] Glosario con anclas por término.
- [ ] Top 5 guías (Tarot, Luna, Runas, Carta Natal, Correspondencias) en MDX y PDF en `public/downloads/{es,en}/`.
- [ ] Top 5 cuadernos (Luna, Tirada, Runas, Intenciones, Autoconocimiento) en PDF imprimible.
- [ ] Pagefind: `"postbuild": "pagefind --site dist"`, filtro por `lang`.
- [ ] JSON-LD: `Article`, `BreadcrumbList`, `WebSite`. OG images por idioma en build.
- [ ] Lighthouse 90+ en home, un artículo y cada herramienta, ambos idiomas.

---

## 11. Fuera de V1 (necesita backend)

- Cuentas y Mi Espacio sincronizado entre dispositivos (V1 guarda en `localStorage`).
- Checkout, entrega de lecturas y libros, emails transaccionales.
- PDFs generados en servidor (V1 usa impresión del navegador).
- Analytics con consentimiento.

Para cada una, un issue `docs:` con método, proveedor, datos y criterio de aceptación antes de escribir código.

## 12. Definición de terminado

- Funciona en ES y EN en 320 px, tablet y desktop.
- `astro check`, Vitest y Playwright en verde.
- Deploy en Pages sin registros `draft` en herramientas publicadas.
- Cada resultado se puede rastrear a un `id` y una versión del dataset.
- Cálculos astronómicos dentro de tolerancia contra sus casos de referencia.
- Ningún dato del usuario sale del navegador.
- WCAG 2.2 AA verificado en ambos idiomas.
- Ningún texto de interpretación escrito por Claude Code.

## 13. Cómo trabajar con Claude Code

1. Una fase por sesión. Empezar en modo plan y aprobar antes de editar.
2. Un issue por tarea, referenciado en rama y PR.
3. Al terminar cada tarea: correr checks, commit, PR.
4. Si una tarea requiere contenido interpretativo, crear la estructura, marcar `draft` y etiquetar el issue `bloqueado-autora`.
