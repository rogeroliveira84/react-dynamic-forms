import { describe, it, expect } from 'vitest'
import { internalToZod } from './schema-to-zod'
import type { InternalSchema } from './internal-schema'

describe('schema-to-zod combobox', () => {
  it('builds a union validator from static options', () => {
    const is: InternalSchema = {
      fields: [
        {
          kind: 'combobox',
          name: 'c',
          required: true,
          options: [
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ],
        },
      ],
    }
    const zod = internalToZod(is)
    expect(zod.safeParse({ c: 'a' }).success).toBe(true)
    expect(zod.safeParse({ c: 'z' }).success).toBe(false)
  })

  it('falls back to a string validator when options are absent (async)', () => {
    const is: InternalSchema = { fields: [{ kind: 'combobox', name: 'c', required: true }] }
    const zod = internalToZod(is)
    expect(zod.safeParse({ c: 'anything' }).success).toBe(true)
    expect(zod.safeParse({ c: 123 }).success).toBe(false)
  })

  it('respects optional', () => {
    const is: InternalSchema = { fields: [{ kind: 'combobox', name: 'c', required: false }] }
    const zod = internalToZod(is)
    expect(zod.safeParse({}).success).toBe(true)
  })
})
