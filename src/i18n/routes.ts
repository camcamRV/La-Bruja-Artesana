import type { Lang } from './ui';

export const routes = {
  home:            { es: '/',                                      en: '/en/' },
  explore:         { es: '/explora/',                              en: '/en/explore/' },
  tarot:           { es: '/explora/tarot/',                        en: '/en/explore/tarot/' },
  dailyCard:       { es: '/explora/tarot/carta-del-dia/',          en: '/en/explore/tarot/card-of-the-day/' },
  runes:           { es: '/explora/runas/',                        en: '/en/explore/runes/' },
  moon:            { es: '/explora/astrologia/luna/',              en: '/en/explore/astrology/moon/' },
  birthChart:      { es: '/explora/astrologia/carta-natal/',       en: '/en/explore/astrology/birth-chart/' },
  astrocarto:      { es: '/explora/astrologia/astrocartografia/',  en: '/en/explore/astrology/astrocartography/' },
  essence:         { es: '/explora/tu-esencia/',                   en: '/en/explore/your-essence/' },
  correspondences: { es: '/explora/magia/correspondencias/',       en: '/en/explore/magic/correspondences/' },
  rituals:         { es: '/explora/magia/rituales/',               en: '/en/explore/magic/rituals/' },
  sigils:          { es: '/explora/magia/sigilos/',                en: '/en/explore/magic/sigils/' },
  shadowWork:      { es: '/explora/magia/shadow-work/',            en: '/en/explore/magic/shadow-work/' },
  sky:             { es: '/explora/cielo/',                        en: '/en/explore/sky/' },
  readings:        { es: '/lecturas/',                             en: '/en/readings/' },
  library:         { es: '/biblioteca/',                           en: '/en/library/' },
  works:           { es: '/obras/',                                en: '/en/works/' },
  grimoire:        { es: '/obras/grimorio/',                       en: '/en/works/grimoire/' },
  shadows:         { es: '/obras/libro-de-sombras/',               en: '/en/works/book-of-shadows/' },
  about:           { es: '/sobre/',                                en: '/en/about/' },
  faq:             { es: '/preguntas/',                            en: '/en/faq/' },
  contact:         { es: '/contacto/',                             en: '/en/contact/' },
} as const satisfies Record<string, Record<Lang, string>>;

export type RouteId = keyof typeof routes;
