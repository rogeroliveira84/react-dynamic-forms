import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { z } from 'zod'
import { useDynamicForm } from './use-dynamic-form'

describe('useDynamicForm', () => {
  it('returns internalSchema from Zod input', () => {
    const { result } = renderHook(() =>
      useDynamicForm({ schema: z.object({ name: z.string() }) }),
    )
    expect(result.current.internalSchema.fields[0]).toMatchObject({ name: 'name', kind: 'text' })
  })

  it('returns internalSchema from JSON Schema input', () => {
    const { result } = renderHook(() =>
      useDynamicForm({
        schema: { type: 'object', properties: { age: { type: 'number' } } } as const,
      }),
    )
    expect(result.current.internalSchema.fields[0]).toMatchObject({ name: 'age', kind: 'number' })
  })

  it('exposes react-hook-form API via form', () => {
    const { result } = renderHook(() =>
      useDynamicForm({ schema: z.object({ a: z.string() }) }),
    )
    expect(typeof result.current.form.register).toBe('function')
    expect(typeof result.current.form.handleSubmit).toBe('function')
  })
})
