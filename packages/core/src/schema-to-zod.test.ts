import { describe, it, expect } from 'vitest'
import { internalToZod } from './schema-to-zod'
import type { InternalSchema } from './internal-schema'

describe('internalToZod', () => {
  it('validates text field minLength', () => {
    const schema: InternalSchema = {
      fields: [{ kind: 'text', name: 'name', required: true, minLength: 3 }],
    }
    const zod = internalToZod(schema)
    expect(zod.safeParse({ name: 'ab' }).success).toBe(false)
    expect(zod.safeParse({ name: 'abc' }).success).toBe(true)
  })

  it('validates email field', () => {
    const zod = internalToZod({
      fields: [{ kind: 'email', name: 'mail', required: true }],
    })
    expect(zod.safeParse({ mail: 'nope' }).success).toBe(false)
    expect(zod.safeParse({ mail: 'a@b.co' }).success).toBe(true)
  })

  it('validates url field', () => {
    const zod = internalToZod({
      fields: [{ kind: 'url', name: 'site', required: true }],
    })
    expect(zod.safeParse({ site: 'not-a-url' }).success).toBe(false)
    expect(zod.safeParse({ site: 'https://example.com' }).success).toBe(true)
  })

  it('validates number min/max', () => {
    const zod = internalToZod({
      fields: [{ kind: 'number', name: 'age', required: true, min: 18, max: 65 }],
    })
    expect(zod.safeParse({ age: 17 }).success).toBe(false)
    expect(zod.safeParse({ age: 66 }).success).toBe(false)
    expect(zod.safeParse({ age: 30 }).success).toBe(true)
  })

  it('validates enum constrains to options', () => {
    const zod = internalToZod({
      fields: [
        {
          kind: 'enum',
          name: 'country',
          required: true,
          options: [
            { value: 'BR', label: 'Brazil' },
            { value: 'US', label: 'US' },
          ],
        },
      ],
    })
    expect(zod.safeParse({ country: 'BR' }).success).toBe(true)
    expect(zod.safeParse({ country: 'DE' }).success).toBe(false)
  })

  it('validates multi-enum as array of options', () => {
    const zod = internalToZod({
      fields: [
        {
          kind: 'multi-enum',
          name: 'langs',
          required: true,
          options: [
            { value: 'pt', label: 'PT' },
            { value: 'en', label: 'EN' },
          ],
        },
      ],
    })
    expect(zod.safeParse({ langs: ['pt', 'en'] }).success).toBe(true)
    expect(zod.safeParse({ langs: ['xx'] }).success).toBe(false)
  })

  it('treats non-required fields as optional', () => {
    const zod = internalToZod({
      fields: [{ kind: 'text', name: 'nickname', required: false }],
    })
    expect(zod.safeParse({}).success).toBe(true)
    expect(zod.safeParse({ nickname: 'roger' }).success).toBe(true)
  })

  it('validates nested object fields', () => {
    const zod = internalToZod({
      fields: [
        {
          kind: 'object',
          name: 'address',
          required: true,
          fields: [
            { kind: 'text', name: 'city', required: true, minLength: 2 },
            { kind: 'text', name: 'country', required: true },
          ],
        },
      ],
    })
    expect(zod.safeParse({ address: { city: 'X', country: 'BR' } }).success).toBe(false)
    expect(zod.safeParse({ address: { city: 'Porto Alegre', country: 'BR' } }).success).toBe(true)
  })

  it('validates array of text items', () => {
    const zod = internalToZod({
      fields: [
        {
          kind: 'array',
          name: 'tags',
          required: true,
          item: { kind: 'text', name: 'tag', required: true },
        },
      ],
    })
    expect(zod.safeParse({ tags: ['a', 'b'] }).success).toBe(true)
    expect(zod.safeParse({ tags: [1, 2] }).success).toBe(false)
  })

  it('coerces date strings to Date', () => {
    const zod = internalToZod({
      fields: [{ kind: 'date', name: 'dob', required: true }],
    })
    const res = zod.safeParse({ dob: '1990-01-01' })
    expect(res.success).toBe(true)
  })

  it('validates file kind with maxSize', () => {
    const zod = internalToZod({
      fields: [{ kind: 'file', name: 'avatar', required: true, maxSize: 100 }],
    })
    const small = new File(['x'], 'a.txt', { type: 'text/plain' })
    const big = new File(['x'.repeat(200)], 'b.txt', { type: 'text/plain' })
    expect(zod.safeParse({ avatar: small }).success).toBe(true)
    expect(zod.safeParse({ avatar: big }).success).toBe(false)
    expect(zod.safeParse({ avatar: 'not-a-file' }).success).toBe(false)
  })

  it('validates multiple files as array', () => {
    const zod = internalToZod({
      fields: [{ kind: 'file', name: 'docs', required: true, multiple: true }],
    })
    const f1 = new File(['a'], 'a.txt')
    const f2 = new File(['b'], 'b.txt')
    expect(zod.safeParse({ docs: [f1, f2] }).success).toBe(true)
    expect(zod.safeParse({ docs: f1 }).success).toBe(false)
  })
})
