import { defaultLang, languages, ui, type Lang, type UiKey } from './ui';
import { routes, type RouteId } from './routes';

export function isLang(value: string | undefined): value is Lang {
  return value !== undefined && value in languages;
}

/** Idioma a partir de la URL: /en/... es inglés, todo lo demás es español. */
export function getLang(url: URL): Lang {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const [, first] = url.pathname.slice(base.length).split('/');
  return isLang(first) ? first : defaultLang;
}

export function t(lang: Lang) {
  return (key: UiKey): string => ui[lang][key];
}

/** Ruta interna localizada, con BASE_URL. Único modo permitido de escribir un href interno. */
export function path(routeId: RouteId, lang: Lang): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + routes[routeId][lang];
}

/** URLs absolutas de la página en cada idioma, para hreflang. */
export function alternate(routeId: RouteId, site: URL): Record<Lang, string> {
  return {
    es: new URL(path(routeId, 'es'), site).href,
    en: new URL(path(routeId, 'en'), site).href,
  };
}

export const otherLang = (lang: Lang): Lang => (lang === 'es' ? 'en' : 'es');
