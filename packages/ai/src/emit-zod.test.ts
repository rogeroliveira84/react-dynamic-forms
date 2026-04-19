import { describe, it, expect } from 'vitest'
import { emitZodCode } from './emit-zod'

describe('emitZodCode', () => {
  it('emits a minimal text field', () => {
    const code = emitZodCode({
      fields: [{ kind: 'text', name: 'name', required: true }],
    })
    expect(code).toContain("import { z } from 'zod'")
    expect(code).toContain('name: z.string()')
  })

  it('emits email + number min/max', () => {
    const code = emitZodCode({
      fields: [
        { kind: 'email', name: 'email', required: true },
        { kind: 'number', name: 'age', required: true, min: 18, max: 120 },
      ],
    })
    expect(code).toContain('email: z.string().email()')
    expect(code).toContain('age: z.number().min(18).max(120)')
  })

  it('marks optional fields with .optional()', () => {
    const code = emitZodCode({
      fields: [{ kind: 'text', name: 'nickname', required: false }],
    })
    expect(code).toContain('nickname: z.string().optional()')
  })

  it('emits enum as z.union of z.literal', () => {
    const code = emitZodCode({
      fields: [
        {
          kind: 'enum',
          name: 'country',
          required: true,
          options: [
            { value: 'BR', label: 'Brazil' },
            { value: 'US', label: 'United States' },
          ],
        },
      ],
    })
    expect(code).toContain('z.union([z.literal("BR"), z.literal("US")])')
  })

  it('emits nested object', () => {
    const code = emitZodCode({
      fields: [
        {
          kind: 'object',
          name: 'address',
          required: true,
          fields: [
            { kind: 'text', name: 'city', required: true },
            { kind: 'text', name: 'country', required: true },
          ],
        },
      ],
    })
    expect(code).toContain('address: z.object(')
    expect(code).toContain('city: z.string()')
  })

  it('emits array of scalars', () => {
    const code = emitZodCode({
      fields: [
        {
          kind: 'array',
          name: 'tags',
          required: true,
          item: { kind: 'text', name: 'tagItem', required: true },
        },
      ],
    })
    expect(code).toContain('tags: z.array(z.string())')
  })

  it('emits describe chain', () => {
    const code = emitZodCode({
      fields: [
        { kind: 'text', name: 'name', required: true, description: 'Full name' },
      ],
    })
    expect(code).toContain('.describe("Full name")')
  })

  it('emits file with maxSize refinement', () => {
    const code = emitZodCode({
      fields: [{ kind: 'file', name: 'photo', required: true, maxSize: 1024 }],
    })
    expect(code).toContain('z.custom<File>')
    expect(code).toContain('size <= 1024')
  })
})
