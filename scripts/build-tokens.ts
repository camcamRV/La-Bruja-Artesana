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
