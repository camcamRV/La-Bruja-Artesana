export const languages = { es: 'Español', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'es';

const es = {
  'site.name': 'La Bruja Artesana',
  'site.description': 'Herramientas esotéricas, biblioteca y obras de La Bruja Artesana. Tarot, runas, astrología y magia, con fuentes y hechos separados de la interpretación.',
  'a11y.skip': 'Saltar al contenido',
  'a11y.home': 'La Bruja Artesana, inicio',
  'nav.label': 'Navegación principal',
  'nav.menu': 'Menú',
  'nav.explore': 'Explora',
  'nav.readings': 'Lecturas',
  'nav.library': 'La Biblioteca Oculta',
  'nav.works': 'Obras',
  'lang.label': 'Idioma',
  'lang.switch': 'Read in English',
  'home.title': 'La Bruja Artesana',
  'home.lead': 'Cada símbolo guarda una historia.',
  'home.soon': 'Estamos preparando el sitio. Muy pronto podrás sacar tu carta del día.',
  'footer.rights': 'Todos los derechos reservados.',
  'notFound.title': 'Página no encontrada',
  'notFound.body': 'Esta página no existe o todavía no está lista.',
  'notFound.home': 'Volver al inicio',
  'tool.draw': 'Sacar carta',
  'tool.version': 'Dataset',
} as const;

type UiKey = keyof typeof es;

export const ui = {
  es,
  en: {
    'site.name': 'La Bruja Artesana',
    'site.description': 'Esoteric tools, library and works by La Bruja Artesana. Tarot, runes, astrology and magic, with sources and facts kept apart from interpretation.',
    'a11y.skip': 'Skip to content',
    'a11y.home': 'La Bruja Artesana, home',
    'nav.label': 'Main navigation',
    'nav.menu': 'Menu',
    'nav.explore': 'Explore',
    'nav.readings': 'Readings',
    'nav.library': 'La Biblioteca Oculta',
    'nav.works': 'Works',
    'lang.label': 'Language',
    'lang.switch': 'Leer en español',
    'home.title': 'La Bruja Artesana',
    'home.lead': 'Every symbol keeps a story.',
    'home.soon': 'We are getting the site ready. Soon you will be able to draw your card of the day.',
    'footer.rights': 'All rights reserved.',
    'notFound.title': 'Page not found',
    'notFound.body': 'This page does not exist or is not ready yet.',
    'notFound.home': 'Back to home',
    'tool.draw': 'Draw a card',
    'tool.version': 'Dataset',
  },
} as const satisfies Record<Lang, Record<UiKey, string>>;

export type { UiKey };
