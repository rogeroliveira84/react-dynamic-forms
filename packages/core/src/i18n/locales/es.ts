import type { RdfMessages } from '../messages'

export const es: RdfMessages = {
  required: 'Obligatorio',
  invalid_type: 'Valor inválido',
  too_small_string: ({ minimum }) =>
    `Mínimo de ${minimum} carácter${Number(minimum) === 1 ? '' : 'es'}`,
  too_big_string: ({ maximum }) =>
    `Máximo de ${maximum} carácter${Number(maximum) === 1 ? '' : 'es'}`,
  too_small_number: ({ minimum }) => `Debe ser ≥ ${minimum}`,
  too_big_number: ({ maximum }) => `Debe ser ≤ ${maximum}`,
  invalid_string_email: 'Introduce un correo válido',
  invalid_string_url: 'Introduce una URL válida',
  invalid_string_regex: 'Formato inválido',
  invalid_enum_value: 'Selecciona una opción válida',
  invalid_date: 'Introduce una fecha válida',
}
