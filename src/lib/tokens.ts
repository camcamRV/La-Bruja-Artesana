import tokens from '../../design/design-tokens.json';

export type Realm = 'noche' | 'medianoche' | 'pergamino';

type Tok = { $value: unknown };
const isTok = (v: unknown): v is Tok => typeof v === 'object' && v !== null && '$value' in v;

/** Valor final de un token (sigue alias {grupo.token}). Para usos fuera de CSS, como <meta name="theme-color">. */
export function tokenValue(path: string): string {
  let node: unknown = tokens;
  for (const k of path.split('.')) node = typeof node === 'object' && node !== null ? (node as Record<string, unknown>)[k] : undefined;
  if (!isTok(node)) throw new Error(`Token desconocido: ${path}`);
  const v = node.$value;
  if (typeof v === 'string') {
    const alias = v.match(/^\{([^}]+)\}$/);
    if (alias?.[1]) return tokenValue(alias[1]);
  }
  return String(v);
}

export const realmBg = (realm: Realm): string => tokenValue(`theme.${realm}.bg`);
