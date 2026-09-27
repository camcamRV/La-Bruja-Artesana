# La Bruja Artesana · Guía visual del frontend

Versión 1.0.0. Fuente de verdad: `design/design-tokens.json` (valores) y `design/ornaments.json` (ornamentos). Este documento explica cómo usarlos.

---

## 1. Concepto

**Observatorio de la artesana.** Un cielo nocturno trabajado a mano: oro grabado sobre ciruela y azul medianoche, pergamino para leer, y los cuatro colores del aura como código de significado.

Las tres referencias y lo que toma cada una:

| Referencia | Qué tomamos | Qué no tomamos |
|---|---|---|
| Patrón celeste ciruela y oro | Fondo ciruela, trazo dorado fino, lunas, glifos planetarios, astrolabios, constelaciones | Constelaciones inventadas (corazones). Aquí son reales, de la IAU |
| Aura (cuatro colores) | Paleta púrpura, verde, beige, teal; frases cortas en capitales grabadas; libros y terciopelo | Frases de destino absoluto ("some destinies can't be escaped") |
| Glowy Atlas (medianoche) | Azul medianoche, marco de arco central, notas de papel manuscritas, luz de vela, iconos de línea dorados | Estética de decoración de interiores como contenido |

Principio rector: **el oro es la luz.** Todo lo dorado es o bien ornamento o bien la acción principal. Si algo es dorado y no es ninguna de las dos, se cambia.

---

## 2. Reinos (temas)

Se activan con `data-realm` en `<html>` (reino de la página) o en una `<section>` (franja de otro reino dentro de la página). Cada reino define las mismas variables `--realm-*`, así que los componentes nunca cambian.

Los tokens que dependen del reino (`gradient.nebula`, `component.plate.bg`, `component.input.bg`, `component.nav.bg`) no viven en `:root`: `build-tokens.ts` los declara en `[data-realm]` para que cada elemento con reino los calcule con sus propios valores. Por eso toda página necesita `data-realm` en `<html>`.

| Reino | Base | Dónde |
|---|---|---|
| `noche` | Ciruela `#1F1424` | Home, Tarot, Runas, Magia, Tu Esencia, Lecturas, Obras, Mi Espacio |
| `medianoche` | Azul `#0E1626` | Cielo, Calendario lunar, Carta Natal, Astrocartografía |
| `pergamino` | Pergamino `#F3EBDA` | Artículos de la Biblioteca Oculta, glosario, legal, vista de impresión |

El cambio de reino es parte del relato: al entrar en astronomía, el cielo se vuelve más profundo; al leer, se enciende la vela sobre papel.

```html
<html lang="es" data-realm="noche">
  <body><main>...</main></body>
</html>

<!-- Artículo de la Biblioteca -->
<html lang="es" data-realm="pergamino">

<!-- Franja de pergamino dentro de una página noche (Home) -->
<section data-realm="pergamino">...</section>
```

Impresión: CSS no puede cambiar el atributo `data-realm`, así que `build-tokens.ts` escribe los valores de `pergamino` dentro de `@media print` para todo `[data-realm]`. Cualquier página se imprime en pergamino sin JavaScript.

---

## 3. Color

### 3.1 Paleta base

| Token | Hex | Rol |
|---|---|---|
| `plum.900` | `#1F1424` | Fondo noche |
| `plum.800` | `#2A1C30` | Superficie (láminas) |
| `navy.900` | `#0E1626` | Fondo medianoche |
| `gold.500` | `#C9A961` | Oro base: ornamentos, bordes, botón primario |
| `gold.300` | `#E6CC8F` | Brillo, foco, estrellas |
| `gold.700` | `#7A5C22` | Oro para texto sobre pergamino |
| `parchment.200` | `#EDE3CF` | Texto sobre oscuro |
| `parchment.100` | `#F3EBDA` | Fondo pergamino |

### 3.2 Contraste verificado (WCAG 2.2)

| Texto | Fondo | Ratio | Uso permitido |
|---|---|---|---|
| `parchment.200` | `plum.900` | 13.9:1 | Todo texto |
| `parchment.400` | `plum.900` | 8.5:1 | Texto secundario |
| `gold.500` | `plum.900` | 7.9:1 | Enlaces, títulos, rótulos |
| `plum.900` | `gold.500` | 7.9:1 | Texto del botón primario |
| `parchment.200` | `aura.purple` | 9.2:1 | Botón aura, badge esotérico |
| `parchment.200` | `aura.teal` | 6.1:1 | Badge astronomía |
| `parchment.200` | `aura.green` | 6.0:1 | Badge botánica |
| `parchment.200` | `gold.700` | 4.88:1 | Badge "Voz de la autora" |
| `gold.700` | `parchment.100` | 5.2:1 | Enlaces y acentos en pergamino |
| `gold.500` | `parchment.100` | 1.9:1 | **Prohibido como texto.** Solo ornamentos |
| `parchment.200` | `gold.600` | 3.13:1 | **Prohibido como texto.** Por eso la capa `editorial` usa `gold.700` |

### 3.3 Los cuatro colores del aura = capas de conocimiento

La regla de datos del proyecto (separar hecho de interpretación) se vuelve visible. Cada bloque de resultado lleva un badge de capa con texto y color:

| Capa | Color | Badge ES | Badge EN |
|---|---|---|---|
| `fact` | Beige (verdad, arraigo) | Dato histórico | Historical fact |
| `astronomy` | Teal (claridad) | Dato astronómico | Astronomical data |
| `botany` | Verde (naturaleza) | Botánica y seguridad | Botany and safety |
| `esoteric` | Púrpura (intuición) | Interpretación · Tradición RWS | Interpretation · RWS tradition |
| `editorial` | Oro profundo (`gold.700`) | Voz de la autora | Author's voice |

El color nunca va solo: el badge siempre dice qué es. Los ornamentos nunca usan colores del aura.

---

## 4. Tipografía

### 4.1 Familias

| Rol | Fuente | Paquete | Uso |
|---|---|---|---|
| Display | **Cinzel** | `@fontsource/cinzel` (400, 600) | Logotipo, H1, H2, nombres de cartas y runas, rótulos grabados |
| Texto | **EB Garamond** | `@fontsource/eb-garamond` (400, 500, 400 italic) | Párrafos, H3 a H6, UI, formularios |
| Manuscrita | **Pinyon Script** | `@fontsource/pinyon-script` (400) | Una nota por vista, como las notas de papel de la referencia |
| Símbolos | **Noto Sans Symbols** | `@fontsource/noto-sans-symbols` (400) | Glifos de planetas, signos y aspectos |
| Rúnica | **Noto Sans Runic** | `@fontsource/noto-sans-runic` (400) | Caracteres del Elder Futhark en la losa de runa |

Las cinco son OFL, self-hosted, sin CDNs. Subsets que usa cada fuente:

| Fuente | Subsets | Rango |
|---|---|---|
| Cinzel, EB Garamond, Pinyon Script | `latin`, `latin-ext` | Tildes, ñ, ¿, ¡ |
| Noto Sans Symbols | `symbols` | U+25A0-27BF y más: ☉ ☽ ♈ ☌ ⚹ |
| Noto Sans Runic | `runic` | U+16A0-16F8: ᚠ ᚢ ᚦ ... |

Importar un archivo por peso y estilo usado (`@fontsource/cinzel/400.css`, `@fontsource/eb-garamond/400-italic.css`...), no el `index.css` del paquete. Cada archivo por peso declara un `@font-face` por subset con su `unicode-range`, así que el navegador solo descarga los subsets cuyos caracteres aparecen en la página (el rúnico, solo en páginas con runas). No importar los archivos de subset sueltos (`runic-400.css`, `latin-400.css`): no traen `unicode-range` y se descargarían siempre.

### 4.2 Reglas

- Cinzel solo en títulos y rótulos. Nunca en párrafos ni en textos de más de ~8 palabras.
- Cinzel ya es capital; no aplicar `text-transform: uppercase` (rompe tildes en algunos lectores y duplica el efecto).
- Rótulos grabados (`typography.engraved`, tracking 0.14em) solo en botones, posiciones de tirada y nombres de paquete. **No** como eyebrow sobre cada título.
- Cuerpo en EB Garamond 18px, interlineado 1.65, medida máxima 66ch.
- El lead (entradilla) va en itálica de EB Garamond. Es el único uso habitual de itálica.
- Pinyon Script: mínimo 1.5rem, nunca información esencial, nunca en botones, máximo una por vista. Siempre con traducción real, no la misma frase en otro idioma sin revisar.
- Texto dorado con `gradient.goldFoil` solo en el `display` del hero y del nombre de una carta revelada. Siempre con `color` sólido de respaldo.
- Números en tablas (grados, horas): `font-variant-numeric: tabular-nums oldstyle-nums` en EB Garamond.

### 4.3 Escala (1.25 sobre 18px)

| Token | rem | px aprox. | Uso |
|---|---|---|---|
| `display` | clamp(2.75, 5.5vw + 1, 5.5) | 44 a 88 | Hero, nombre de la herramienta |
| `4xl` | 3.43 | 55 | H1 |
| `3xl` | 2.75 | 44 | H2 |
| `2xl` | 2.20 | 35 | H3, nota manuscrita |
| `xl` | 1.76 | 28 | H4 |
| `lg` | 1.41 | 23 | Lead |
| `base` | 1.125 | 18 | Cuerpo |
| `sm` | 0.94 | 15 | Rótulos, metadatos |
| `xs` | 0.81 | 13 | Versión del dataset, créditos |

---

## 5. Layout

### 5.1 Principios

- **Simetría ceremonial en los umbrales, lectura a la izquierda.** Hero, cabecera de herramienta y resultado revelado van centrados. Texto corrido, formularios y tablas, alineados a la izquierda.
- Contenedores: `prose` 42rem, `content` 72rem, `wide` 90rem. Margen lateral `space.gutter`.
- Separación entre secciones `space.section`. Las secciones se separan con espacio o con `divider-moon`, nunca con ambos.
- Mobile first desde 320px. En móvil el arco del hero ocupa todo el ancho menos el gutter.

### 5.2 Home

```
┌────────────────────────────────────────────────┐
│ ☾ LA BRUJA ARTESANA        Explora Lecturas ... │  nav translúcida
├────────────────────────────────────────────────┤
│  · ✦        ·   starfield   ·        ✦    ·    │
│              ╭──────────────╮                  │
│             ╱       ✦        ╲                 │  arch-frame + astrolabio
│            │  LA BRUJA        │                │  detrás, girando lento
│            │  ARTESANA        │                │
│            │  Cada símbolo    │                │  lead itálica
│            │  guarda una      │                │
│            │  historia.       │                │
│            │ [Saca tu carta]  │                │  botón primario
│            └──────────────────┘                │
│   ┌ nota ┐ "algunas son tuyas"                 │  única nota manuscrita
├────────────── ─── ☾ ─── ───────────────────────┤  divider-moon
│  Carta del Día (lámina centrada con la carta)  │
├────────────────────────────────────────────────┤
│  Explora: 12 herramientas en 5 grupos          │  grid 1 / 2 / 3 col
│  [Tarot] [Runas] [Astrología] [Magia] [Cielo]  │
├────────────────────────────────────────────────┤
│  Lecturas: 3 láminas, La Lectura al centro     │
│  con esquineros y borde oro                     │
├────────────────────────────────────────────────┤
│  Biblioteca Oculta (franja pergamino)          │
├────────────────────────────────────────────────┤
│  Obras: libros en estante (lomos verticales)   │
└────────────────────────────────────────────────┘
```

### 5.3 Página de herramienta

```
┌────────────────────────────────────────────────┐
│          ╭────────╮                            │
│         ╱  ✦       ╲    Nombre (display)       │  cabecera centrada en arco
│        │  Pregunta   │  Una línea de qué hace  │  (arco más bajo que el hero)
│        │  al Tarot   │                         │
├────────────────────────────────────────────────┤
│  Lámina de entrada (izquierda, max prose)      │
│  Pregunta: [__________________________]        │
│  Tirada:   (•) 1 carta ( ) 3 cartas            │
│  [ ] Incluir invertidas                        │
│  [Sacar carta]                                 │
├────────────────────────────────────────────────┤
│  Resultado (centrado)                          │
│   ┌──┐ ┌──┐ ┌──┐   cartas 11:19 con glow       │
│   └──┘ └──┘ └──┘                               │
│   PASADO PRESENTE FUTURO   rótulos grabados     │
├────────────────────────────────────────────────┤
│  Lámina de lectura (izquierda)                 │
│  [Interpretación · RWS]  significado           │
│  [Voz de la autora]      reflexión             │
│  ── ✦ ──                                       │
│  ¿Qué parte de esta carta ya conoces?          │  pregunta de vuelta
│  [Guardar] [Compartir]      Dataset 1.0.0      │
├────────────────────────────────────────────────┤
│  Siguiente paso: lámina CTA en arco            │
└────────────────────────────────────────────────┘
```

### 5.4 Artículo de la Biblioteca (pergamino)

```
┌────────────────────────────────────────────────┐
│  Biblioteca / Runas                            │  migas de pan
│  Las 24 runas del Elder Futhark      (H1)      │
│  Entradilla en itálica                         │
│  [Dato histórico] [Conocimiento público]       │
│  ── ✦ ──                                       │
│  Texto 66ch, capitular Cinzel en el primer     │
│  párrafo, notas al margen en desktop           │
│  ...                                           │
│  ── ☾ ──                                       │
│  Fuentes (lista numerada, es una secuencia)    │
│  Herramienta relacionada: [Pregunta a las Runas]│
└────────────────────────────────────────────────┘
```

---

## 6. Ornamentos

Catálogo completo con SVG en `ornaments.json`. Reglas:

1. **Uno focal por viewport.** Astrolabio, arco o luna grande. El resto son acompañantes pequeños.
2. **Oro o nada.** `currentColor` heredando `--realm-accent`. En pergamino, `gold.700`.
3. **Verdad incluso en lo decorativo.** Las constelaciones de fondo son reales (IAU). Las fases lunares que se muestran como dato se calculan. Una luna puramente decorativa es la creciente fija, nunca una fase que parezca fechada.
4. **Decorativo = invisible para lectores de pantalla** (`aria-hidden="true"`). Informativo (fase lunar real, glifo en la carta natal) lleva `<title>` localizado.
5. **Mapa de uso:**

| Ornamento | Dónde |
|---|---|
| `star-8` | Sobre el título del hero y de cada herramienta |
| `divider-star` | Dentro de láminas, entre bloques |
| `divider-moon` | Entre secciones de página |
| `corner-flourish` | Láminas destacadas: resultado, La Lectura |
| `arch-frame` | Hero y cabecera de herramienta |
| `astrolabe` | Hero, reverso de carta, fondo de la rueda natal |
| `starfield` | Fondo fijo de los reinos oscuros |
| `constellation` | Un acento por sección de hub |
| `sun-rays`, `moon-crescent` | Iconos de Carta del Día y Calendario lunar |

---

## 7. Componentes

Todos en `src/components/ui/` y `src/components/ornaments/`. Todos leen solo variables CSS; ningún hex en componentes.

### 7.1 Botón

| Variante | Fondo | Texto | Borde | Uso |
|---|---|---|---|---|
| `primary` | `gold.500` | `plum.900` | ninguno | Una sola acción principal por vista |
| `secondary` | transparente | `parchment.200` | 1px `gold.500` | Acciones secundarias |
| `aura` | `aura.purple` | `parchment.200` | 1px `gold.500` | CTA a lecturas de pago |
| `ghost` | transparente | `gold.500` | ninguno | Terciarias, enlaces con aspecto de acción |

Altura 48px, padding horizontal 32px, radio 4px, texto `typography.engraved`. Hover: `primary` pasa a `gold.300` con `shadow.glowSm`. Sin flechas añadidas al texto. El verbo dice exactamente lo que pasa: "Sacar carta", "Guardar en este dispositivo", "Descargar SVG".

### 7.2 Lámina (`Plate`)

Contenedor de resultados y tarjetas. Doble filete grabado como las cartas antiguas:

```css
.plate {
  background: var(--realm-surface);
  border: var(--border-hairline);
  border-radius: var(--radius-md);
  padding: var(--component-plate-padding);
  outline: var(--component-plate-inner-rule);
  outline-offset: calc(var(--border-engraved-inset) * -1);
}
.plate[data-featured] { /* + 4 corner-flourish absolutos */ }
```

No todo es lámina: texto corrido y listas viven directamente sobre el fondo. Las láminas son para cosas que se revelan o se eligen.

### 7.3 Carta de tarot

- `aspect-ratio: 11 / 19` (proporción real RWS), radio 12px, borde 1px `gold.500`.
- Reverso: `TarotBack` (astrolabio, simétrico para no delatar invertidas).
- Revelado: giro 3D en Y de 900ms `easing.inOut`, luego `shadow.glowMd`. Con `prefers-reduced-motion`: fundido de 150ms.
- Invertida: la imagen rota 180°, el nombre no. Rótulo "Invertida" en texto.
- Anverso: baraja propia de La Bruja Artesana, dibujada en código como SVG (`TarotCard`, ver `ornaments.json` > `generative` > `tarot-front`). Mismo lenguaje que el resto del sitio: filete dorado grabado, número, símbolos del palo, nombre en Cinzel, motivos de astrolabio. Sin escenas figurativas, sin escaneos y sin imágenes generadas con IA.
- Los significados siguen la tradición RWS (`deck: "rws"` en los datos). El arte es propio; la tradición interpretativa se declara con el badge de capa.

### 7.4 Losa de runa

`aspect-ratio: 3 / 4`, fondo `plum.700` con textura sutil de piedra (SVG noise al 6%), carácter en **Noto Sans Runic** (`@fontsource/noto-sans-runic`) grabado en `gold.300`. Transliteración debajo en EB Garamond.

### 7.5 Badge de capa

Altura 28px, radio 4px, padding 0 12px, `typography.small` en medium. Fondo = color de la capa (3.3), texto `parchment.200` (en beige, `plum.900`). Siempre texto; icono opcional a la izquierda.

### 7.6 Campos de formulario

Altura 48px, fondo superficie al 70%, borde hairline dorado, foco con borde `gold.300` + anillo de foco. Etiqueta siempre visible arriba (no solo placeholder). Error: texto `feedback.error` debajo que dice qué pasó y cómo arreglarlo ("Falta la ciudad de nacimiento. Escribe al menos 3 letras.").

### 7.7 Navegación

Altura 72px, `sticky`, fondo del reino al 85% con `backdrop-filter: blur(12px)`. Izquierda: `moon-crescent` + "La Bruja Artesana" en Cinzel 600. Derecha: enlaces en EB Garamond 500, selector ES/EN con el icono `language`. En móvil: menú en panel a pantalla completa, fondo `bgDeep` con starfield.

### 7.8 Cabecera en arco (`ArchHero`)

Contenedor con `border-radius: var(--radius-arch)`, borde hairline, `arch-frame` como filete interior, `star-8` en la clave del arco. Ancho: 100% en móvil, 28rem en desktop para el hero, 22rem para herramientas. Detrás, el astrolabio al 140% del ancho del arco, opacidad 0.35.

### 7.9 Nota manuscrita (`PaperNote`)

Recorte de pergamino `parchment.300` con borde irregular (clip-path), rotación entre -3° y 3°, chincheta dorada o cinta. Texto en Pinyon Script `plum.900`. Una por vista como máximo. En móvil se coloca en flujo, sin rotación.

### 7.10 `ToolResult`

Orden fijo: elemento revelado (centrado) → badges de capa → significado → voz de la autora → `divider-star` → pregunta de vuelta (lead itálica) → acciones → versión del dataset (`xs`, `textMuted`) → lámina de siguiente paso.

### 7.11 Estante de obras

Libros como lomos verticales (como la referencia Aura): cada lomo con color del aura, título en Cinzel vertical (`writing-mode: vertical-rl`), sparkle arriba y abajo. Al enfocar o pasar el cursor, el libro sale 8px y aparece su ficha.

---

## 8. Movimiento

Un solo momento orquestado por página:

| Página | Momento |
|---|---|
| Home | Al cargar: starfield aparece (600ms), luego el arco y el título (900ms). El astrolabio gira 360° en 240s |
| Herramientas | El revelado del resultado (volteo de carta, runa que emerge, fase que se ilumina) |
| Biblioteca | Ninguno |

Resto: transiciones de 150 a 250ms solo como respuesta a una acción (abrir, seleccionar, confirmar). Nada de fundidos al hacer scroll en cada sección.

`prefers-reduced-motion: reduce`: sin twinkle, sin rotación, volteos reemplazados por fundido de 150ms.

---

## 9. Fotografía e imagen

- Estilo de la referencia Glowy Atlas y Aura: luz de vela, libros, terciopelo verde y púrpura, cristales, latón. Cálida, con sombras profundas.
- Gradación: sombras hacia `plum.950` o `navy.950`, altas luces cálidas hacia `gold.200`.
- Fotos propias o con licencia. Registrar licencia y autor en `src/data/credits.json`.
- Formatos: AVIF + WebP con `<Image>` / `<Picture>` de Astro, `loading="lazy"` salvo el hero.
- Nunca imágenes generadas con IA que imiten cartas del tarot, runas antiguas o símbolos de tradiciones cerradas. Las cartas del sitio se dibujan en código (7.3).

---

## 10. Accesibilidad

- Contrastes de 3.2 respetados. Oro sobre pergamino solo como ornamento.
- Foco visible: `outline: 2px solid gold.300`, offset 3px (en pergamino, `aura.purple`).
- Objetivos táctiles mínimo 44px.
- `lang` correcto en el `<html>`, `lang="la"` en nombres latinos de constelaciones y `translate="no"` en nombres de runas.
- Glifos astrológicos siempre con nombre accesible localizado.
- Gráficos (rueda natal, mapa estelar, astrocartografía) con `<title>`, `<desc>` y tabla equivalente.
- Resultado anunciado con `aria-live="polite"`.

---

## 11. Implementación en Astro

### 11.1 Archivos

```
design/
  design-tokens.json
  ornaments.json
  STYLE-GUIDE.md
  BA_LOGO.svg       # logotipo, trazo en currentColor
scripts/
  build-tokens.ts
src/styles/
  tokens.css        # generado, no editar
  global.css        # reset, tipografía base, reinos
  print.css
src/components/ornaments/
  Ornament.astro    # <Ornament id="star-8" size={32} />
  MoonPhase.astro  MoonPhase.tsx
  Astrolabe.astro  StarField.astro  Constellation.astro
  TarotCard.astro   TarotBack.astro  SuitSymbol.astro
src/components/ui/
  Button.astro  Plate.astro  Badge.astro  ArchHero.astro
  PaperNote.astro  Divider.astro  Field.astro  BookShelf.astro
```

### 11.2 `scripts/build-tokens.ts`

Convierte `design-tokens.json` en `src/styles/tokens.css`. Corre en `prebuild` y en `predev`. Probado con `tsc --strict` y en Chrome (reinos en pantalla, franja de pergamino dentro de noche, e impresión).

Salida, en este orden: `:root` (tokens globales), un bloque por reino, `[data-realm]` (tokens que usan `var(--realm-*)`), `@media print` (valores de pergamino) y las clases `.t-*` de tipografía.

```ts
import fs from 'node:fs';

type Tok = { $value: unknown; $type?: string };
type Group = { [key: string]: unknown };

const isObj = (v: unknown): v is Group => typeof v === 'object' && v !== null && !Array.isArray(v);
const isTok = (v: unknown): v is Tok => isObj(v) && '$value' in v;
const entries = (g: Group) => Object.entries(g).filter(([k]) => !k.startsWith('$'));

const tokens: unknown = JSON.parse(fs.readFileSync('design/design-tokens.json', 'utf8'));
if (!isObj(tokens)) throw new Error('design-tokens.json no es un objeto');

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

function get(path: string): Tok {
  let node: unknown = tokens;
  for (const k of path.split('.')) node = isObj(node) ? node[k] : undefined;
  if (!isTok(node)) throw new Error(`Alias roto: ${path}`);
  return node;
}

function group(name: string): Group {
  const g = (tokens as Group)[name];
  if (!isObj(g)) throw new Error(`Falta el grupo ${name}`);
  return g;
}

function format(v: unknown, type?: string): string {
  if (type === 'fontFamily' && Array.isArray(v)) return v.map((f) => (/\s/.test(String(f)) ? `"${f}"` : String(f))).join(', ');
  if (type === 'cubicBezier' && Array.isArray(v)) return `cubic-bezier(${v.join(', ')})`;
  return String(v);
}

function resolve(v: unknown, type?: string): string {
  if (typeof v !== 'string') return format(v, type);
  const whole = v.match(/^\{([^}]+)\}$/);
  if (whole?.[1]) {
    const t = get(whole[1]);
    return resolve(t.$value, t.$type);
  }
  return v.replace(/\{([^}]+)\}/g, (_, p: string) => {
    const t = get(p);
    return resolve(t.$value, t.$type);
  });
}

// Tokens globales. Los que usan var(--realm-*) van aparte: si se declaran en :root
// se calculan ahí, donde --realm-* no existe, y quedan vacíos. Por eso se repiten
// en cada elemento con data-realm, para que usen los valores de su propio reino.
const SKIP = new Set(['meta', 'theme', 'typography']);
const root: string[] = [];
const realmDependent: string[] = [];

function walk(node: Group, path: string[]): void {
  for (const [k, v] of entries(node)) {
    if (path.length === 0 && SKIP.has(k)) continue;
    if (isTok(v)) {
      const value = resolve(v.$value, v.$type);
      const line = `  --${[...path, k].map(kebab).join('-')}: ${value};`;
      (value.includes('var(--realm-') ? realmDependent : root).push(line);
    } else if (isObj(v)) {
      walk(v, [...path, k]);
    }
  }
}
walk(tokens, []);

function realmVars(realm: string): string[] {
  const vars = group('theme')[realm];
  if (!isObj(vars)) throw new Error(`Reino desconocido: ${realm}`);
  const scheme = realm === 'pergamino' ? 'light' : 'dark';
  return [
    `  color-scheme: ${scheme};`,
    ...entries(vars).map(([k, t]) => {
      if (!isTok(t)) throw new Error(`Token de reino inválido: ${realm}.${k}`);
      return `  --realm-${kebab(k)}: ${resolve(t.$value, t.$type)};`;
    }),
  ];
}

const realms = entries(group('theme')).map(
  ([realm]) => `[data-realm="${realm}"] {\n${realmVars(realm).join('\n')}\n}`,
);

// Impresión: CSS no puede cambiar el atributo data-realm, así que se fuerzan
// los valores de pergamino en todo elemento con reino. Va después de los reinos
// (misma especificidad), así que gana.
const print = `@media print {\n  [data-realm] {\n${realmVars('pergamino').map((l) => '  ' + l).join('\n')}\n  }\n}`;

const type = entries(group('typography')).map(([name, t]) => {
  if (!isTok(t) || !isObj(t.$value)) throw new Error(`Tipografía inválida: ${name}`);
  const css = Object.entries(t.$value).map(([p, x]) => `  ${kebab(p)}: ${resolve(x)};`);
  return `.t-${name} {\n${css.join('\n')}\n}`;
});

const out = [
  '/* Generado por scripts/build-tokens.ts. No editar. */',
  `:root {\n${root.join('\n')}\n}`,
  ...realms,
  `[data-realm] {\n${realmDependent.join('\n')}\n}`,
  print,
  ...type,
].join('\n\n');

fs.mkdirSync('src/styles', { recursive: true });
fs.writeFileSync('src/styles/tokens.css', out + '\n');
console.log('tokens.css generado');
```

Nota: `fontFamily` dentro de tipografía se resuelve por alias, así que llega ya formateado.

### 11.3 `global.css` (base)

```css
@import './tokens.css';

html { font-size: 100%; -webkit-text-size-adjust: 100%; }
body {
  background-color: var(--realm-bg);
  background-image: var(--gradient-nebula);
  background-attachment: fixed;
  color: var(--realm-text);
  font-family: var(--font-family-body);
  font-size: var(--font-size-base);
  line-height: var(--font-line-height-body);
  font-variant-numeric: oldstyle-nums;
}
h1, h2 { font-family: var(--font-family-display); font-weight: 400; letter-spacing: var(--font-letter-spacing-display); text-wrap: balance; }
h1 { font-size: var(--font-size-4xl); line-height: var(--font-line-height-heading); }
h2 { font-size: var(--font-size-3xl); line-height: var(--font-line-height-heading); }
h3 { font-size: var(--font-size-2xl); font-weight: 500; }
p, li { max-width: var(--font-measure-prose); text-wrap: pretty; }
a { color: var(--realm-accent); text-underline-offset: 0.2em; text-decoration-thickness: 1px; }
a:hover { color: var(--realm-accent-strong); }
:focus-visible { outline: var(--focus-ring); outline-offset: var(--focus-offset); }
[data-realm="pergamino"] :focus-visible { outline: var(--focus-ring-on-light); }
::selection { background: var(--color-gold-500); color: var(--color-plum-900); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 1ms !important; animation-iteration-count: 1 !important; transition-duration: 1ms !important; }
}
```

### 11.4 `Ornament.astro`

```astro
---
import catalog from '../../../design/ornaments.json';
interface Props {
  id: string;
  size?: number;        // iconos cuadrados
  width?: number;       // divisores y ornamentos no cuadrados (ej. 240x24)
  height?: number;
  class?: string;
  title?: string;       // solo si el ornamento es informativo
}
const { id, size = 24, width = size, height = size, class: cls, title } = Astro.props;
const item = catalog.static.find((o) => o.id === id);
if (!item) throw new Error(`Ornamento desconocido: ${id}`);
let svg = item.svg.replace('<svg ', `<svg width="${width}" height="${height}" class="ornament ${cls ?? ''}" `);
if (title) svg = svg.replace("aria-hidden='true'", "role='img'").replace('>', `><title>${title}</title>`);
---
<Fragment set:html={svg} />
```

Los divisores (240x24) reciben `width` y `height` explícitos en vez de `size`: `<Ornament id="divider-moon" width={240} height={24} />`.

### 11.5 Tareas para Claude Code

- [ ] Copiar `design/` al repo.
- [ ] Instalar fuentes: `@fontsource/cinzel`, `@fontsource/eb-garamond`, `@fontsource/pinyon-script`, `@fontsource/noto-sans-symbols`, `@fontsource/noto-sans-runic`. Importar solo pesos y subsets usados (4.1).
- [ ] `scripts/build-tokens.ts` + scripts `predev` y `prebuild`. Test: todos los alias resuelven.
- [ ] `global.css` y `print.css`. Los colores de pergamino en impresión ya vienen de `tokens.css`; `print.css` solo oculta nav, starfield y ornamentos grandes, y añade el pie con fecha, idioma y versión del dataset.
- [ ] Ornamentos estáticos: `Ornament.astro` + test de que cada `id` renderiza.
- [ ] Generativos: `MoonPhase`, `Astrolabe`, `StarField` (seeded, build), `Constellation` (datos IAU).
- [ ] Componentes UI de la sección 7, cada uno con página de ejemplo en `/dev/ui` (excluida del sitemap y del build de producción).
- [ ] Verificar contraste de la tabla 3.2 con un test automático (axe en Playwright) en los tres reinos.
- [ ] Capturas en 320, 768 y 1280 de Home, una herramienta y un artículo, revisadas contra los wireframes.

---

## 12. Qué no hacer

- Oro sobre pergamino como texto.
- Más de un ornamento focal por pantalla.
- Constelaciones, fases lunares o glifos inventados que parezcan datos.
- Colores del aura como decoración: siempre significan una capa de conocimiento.
- Eyebrows en mayúsculas sobre cada título, flechas añadidas a botones, animaciones de entrada en cada sección.
- Pinyon Script para información que el usuario necesita.
- Em dashes en cualquier texto.
