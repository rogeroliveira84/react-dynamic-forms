import type { RdfMessages } from './messages'
import { en } from './locales/en'
import { ptBR } from './locales/pt-BR'
import { es } from './locales/es'

export type RdfLocale = 'en' | 'pt-BR' | 'es'

/** A built-in locale name, or a custom message object. */
export type RdfLocaleInput = RdfLocale | RdfMessages

const PACKS: Record<RdfLocale, RdfMessages> = { en, 'pt-BR': ptBR, es }

/**
 * Merge the English base, the chosen locale (built-in name or custom object),
 * then per-key overrides on top. Unknown locale names fall back to English.
 */
export function resolveMessages(locale?: RdfLocaleInput, overrides?: RdfMessages): RdfMessages {
  let pack: RdfMessages = en
  if (typeof locale === 'string') {
    pack = PACKS[locale as RdfLocale] ?? en
  } else if (locale) {
    pack = locale
  }
  return { ...en, ...pack, ...(overrides ?? {}) }
}
