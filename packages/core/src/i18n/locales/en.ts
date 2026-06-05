import type { RdfMessages } from '../messages'

export const en: RdfMessages = {
  required: 'Required',
  invalid_type: 'Invalid value',
  too_small_string: ({ minimum }) =>
    `Must be at least ${minimum} character${Number(minimum) === 1 ? '' : 's'}`,
  too_big_string: ({ maximum }) =>
    `Must be at most ${maximum} character${Number(maximum) === 1 ? '' : 's'}`,
  too_small_number: ({ minimum }) => `Must be ≥ ${minimum}`,
  too_big_number: ({ maximum }) => `Must be ≤ ${maximum}`,
  invalid_string_email: 'Enter a valid email',
  invalid_string_url: 'Enter a valid URL',
  invalid_string_regex: 'Invalid format',
  invalid_enum_value: 'Select a valid option',
  invalid_date: 'Enter a valid date',
}
