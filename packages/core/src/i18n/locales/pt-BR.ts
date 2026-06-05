import type { RdfMessages } from '../messages'

export const ptBR: RdfMessages = {
  required: 'Obrigatório',
  invalid_type: 'Valor inválido',
  too_small_string: ({ minimum }) =>
    `Mínimo de ${minimum} caractere${Number(minimum) === 1 ? '' : 's'}`,
  too_big_string: ({ maximum }) =>
    `Máximo de ${maximum} caractere${Number(maximum) === 1 ? '' : 's'}`,
  too_small_number: ({ minimum }) => `Deve ser ≥ ${minimum}`,
  too_big_number: ({ maximum }) => `Deve ser ≤ ${maximum}`,
  invalid_string_email: 'Informe um e-mail válido',
  invalid_string_url: 'Informe uma URL válida',
  invalid_string_regex: 'Formato inválido',
  invalid_enum_value: 'Selecione uma opção válida',
  invalid_date: 'Informe uma data válida',
}
