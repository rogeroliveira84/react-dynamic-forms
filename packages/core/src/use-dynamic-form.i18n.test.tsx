import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { z } from 'zod'
import { useDynamicForm } from './use-dynamic-form'

async function emailError(options: Parameters<typeof useDynamicForm>[0]): Promise<string | undefined> {
  const { result } = renderHook(() => {
    const r = useDynamicForm(options)
    // Subscribe to errors during render so RHF keeps formState.errors live.
    void r.form.formState.errors
    return r
  })
  await act(async () => {
    result.current.form.setValue('email', 'nope')
    await result.current.form.handleSubmit(() => {})()
  })
  return result.current.form.formState.errors.email?.message as string | undefined
}

describe('useDynamicForm i18n', () => {
  const schema = z.object({ email: z.string().email() })

  it('localizes validation messages when a locale is set', async () => {
    expect(await emailError({ schema, locale: 'pt-BR' })).toBe('Informe um e-mail válido')
  })

  it('applies per-key overrides on top of the locale', async () => {
    expect(
      await emailError({ schema, locale: 'pt-BR', messages: { invalid_string_email: 'E-mail ruim' } }),
    ).toBe('E-mail ruim')
  })

  it('keeps the default English behavior when no locale is set', async () => {
    expect(await emailError({ schema })).toMatch(/invalid email/i)
  })
})
