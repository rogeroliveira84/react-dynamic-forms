import { describe, it, expect } from 'vitest'
import { z, type ZodErrorMap } from 'zod'
import { createErrorMap, resolveMessages } from './index'

function firstError(schema: z.ZodTypeAny, value: unknown, errorMap: ZodErrorMap): string | undefined {
  const res = schema.safeParse(value, { errorMap })
  return res.success ? undefined : res.error.issues[0]?.message
}

describe('i18n error map', () => {
  it('localizes the email error in pt-BR', () => {
    const map = createErrorMap(resolveMessages('pt-BR'))
    expect(firstError(z.string().email(), 'nope', map)).toBe('Informe um e-mail válido')
  })

  it('localizes the email error in es', () => {
    const map = createErrorMap(resolveMessages('es'))
    expect(firstError(z.string().email(), 'nope', map)).toBe('Introduce un correo válido')
  })

  it('falls back to English for an unknown locale', () => {
    const map = createErrorMap(resolveMessages('xx' as never))
    expect(firstError(z.string().email(), 'nope', map)).toBe('Enter a valid email')
  })

  it('lets an override beat the locale pack', () => {
    const map = createErrorMap(resolveMessages('pt-BR', { invalid_string_email: 'E-mail ruim' }))
    expect(firstError(z.string().email(), 'nope', map)).toBe('E-mail ruim')
  })

  it('lets an explicit schema message win over the error map', () => {
    const map = createErrorMap(resolveMessages('pt-BR'))
    expect(firstError(z.string().email({ message: 'MINE' }), 'nope', map)).toBe('MINE')
  })

  it('localizes a missing required field in pt-BR', () => {
    const map = createErrorMap(resolveMessages('pt-BR'))
    expect(firstError(z.object({ name: z.string() }), {}, map)).toBe('Obrigatório')
  })

  it('interpolates the minimum into a too_small string message', () => {
    const map = createErrorMap(resolveMessages('pt-BR'))
    expect(firstError(z.string().min(5), 'ab', map)).toBe('Mínimo de 5 caracteres')
  })

  it('accepts a custom message object as the locale', () => {
    const map = createErrorMap(resolveMessages({ invalid_string_email: 'Custom' }))
    expect(firstError(z.string().email(), 'nope', map)).toBe('Custom')
  })
})
