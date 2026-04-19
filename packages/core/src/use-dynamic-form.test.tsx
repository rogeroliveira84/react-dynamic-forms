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

  it('applies defaultValues to the form state', () => {
    const { result } = renderHook(() =>
      useDynamicForm<{ name: string }>({
        schema: z.object({ name: z.string() }),
        defaultValues: { name: 'Roger' },
      }),
    )
    expect(result.current.form.getValues('name')).toBe('Roger')
  })

  it('memoizes internal + zod schemas across renders when input identity is stable', () => {
    const schema = z.object({ a: z.string() })
    const { result, rerender } = renderHook(() => useDynamicForm({ schema }))
    const firstInternal = result.current.internalSchema
    const firstZod = result.current.zodSchema
    rerender()
    expect(result.current.internalSchema).toBe(firstInternal)
    expect(result.current.zodSchema).toBe(firstZod)
  })
})
