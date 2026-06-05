import { ZodIssueCode, type ZodErrorMap } from 'zod'
import type { RdfMessageKey, RdfMessageParams, RdfMessages } from './messages'

/**
 * Build a Zod error map from a resolved message set. Returned messages are used
 * for the issues we localize; anything else falls back to Zod's `defaultError`.
 * Messages set explicitly on a schema (e.g. `z.string().email({ message })`)
 * still win — Zod consults them before this map.
 */
export function createErrorMap(messages: RdfMessages): ZodErrorMap {
  const pick = (key: RdfMessageKey, params?: RdfMessageParams): string | undefined => {
    const value = messages[key]
    if (value === undefined) return undefined
    return typeof value === 'function' ? value(params ?? {}) : value
  }

  return (issue, ctx) => {
    let message: string | undefined

    switch (issue.code) {
      case ZodIssueCode.invalid_type:
        message = issue.received === 'undefined' ? pick('required') : pick('invalid_type')
        break
      case ZodIssueCode.too_small:
        if (issue.type === 'string') message = pick('too_small_string', { minimum: issue.minimum })
        else if (issue.type === 'number') message = pick('too_small_number', { minimum: issue.minimum })
        break
      case ZodIssueCode.too_big:
        if (issue.type === 'string') message = pick('too_big_string', { maximum: issue.maximum })
        else if (issue.type === 'number') message = pick('too_big_number', { maximum: issue.maximum })
        break
      case ZodIssueCode.invalid_string:
        if (issue.validation === 'email') message = pick('invalid_string_email')
        else if (issue.validation === 'url') message = pick('invalid_string_url')
        else if (issue.validation === 'regex') message = pick('invalid_string_regex')
        break
      case ZodIssueCode.invalid_enum_value:
        message = pick('invalid_enum_value', { options: issue.options })
        break
      case ZodIssueCode.invalid_date:
        message = pick('invalid_date')
        break
    }

    return { message: message ?? ctx.defaultError }
  }
}
