import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { zodToInternalSchema } from './zod'
import type { ObjectFieldSpec, ArrayFieldSpec } from '../internal-schema'

describe('zodToInternalSchema', () => {
  it('converts string field to text kind', () => {
    const schema = z.object({ name: z.string() })
    const result = zodToInternalSchema(schema)
    expect(result.fields).toHaveLength(1)
    expect(result.fields[0]).toMatchObject({ kind: 'text', name: 'name', required: true })
  })

  it('detects email from .email()', () => {
    const schema = z.object({ mail: z.string().email() })
    const result = zodToInternalSchema(schema)
    expect(result.fields[0]).toMatchObject({ kind: 'email' })
  })

  it('detects url from .url()', () => {
    const schema = z.object({ site: z.string().url() })
    expect(zodToInternalSchema(schema).fields[0]).toMatchObject({ kind: 'url' })
  })

  it('converts number with min/max', () => {
    const schema = z.object({ age: z.number().min(18).max(120) })
    const result = zodToInternalSchema(schema)
    expect(result.fields[0]).toMatchObject({ kind: 'number', min: 18, max: 120 })
  })

  it('converts boolean to boolean kind', () => {
    const schema = z.object({ news: z.boolean() })
    expect(zodToInternalSchema(schema).fields[0]).toMatchObject({ kind: 'boolean' })
  })

  it('converts z.date() to date kind', () => {
    const schema = z.object({ dob: z.date() })
    expect(zodToInternalSchema(schema).fields[0]).toMatchObject({ kind: 'date' })
  })

  it('converts z.enum() to enum kind with options', () => {
    const schema = z.object({ country: z.enum(['BR', 'US']) })
    const result = zodToInternalSchema(schema)
    expect(result.fields[0]).toMatchObject({
      kind: 'enum',
      options: [
        { value: 'BR', label: 'BR' },
        { value: 'US', label: 'US' },
      ],
    })
  })

  it('marks optional fields as not required', () => {
    const schema = z.object({ nick: z.string().optional() })
    expect(zodToInternalSchema(schema).fields[0]).toMatchObject({ required: false })
  })

  it('uses .describe() as description', () => {
    const schema = z.object({ name: z.string().describe('Full name') })
    expect(zodToInternalSchema(schema).fields[0]).toMatchObject({ description: 'Full name' })
  })

  it('converts nested z.object to object kind', () => {
    const schema = z.object({ addr: z.object({ city: z.string() }) })
    const result = zodToInternalSchema(schema)
    const first = result.fields[0] as ObjectFieldSpec
    expect(first).toMatchObject({ kind: 'object', name: 'addr' })
    expect(first.fields[0]).toMatchObject({ kind: 'text', name: 'city' })
  })

  it('converts z.array(z.string()) to array kind', () => {
    const schema = z.object({ tags: z.array(z.string()) })
    const result = zodToInternalSchema(schema)
    const first = result.fields[0] as ArrayFieldSpec
    expect(first).toMatchObject({ kind: 'array' })
    expect(first.item).toMatchObject({ kind: 'text' })
  })

  it('converts z.array(z.enum()) to multi-enum kind', () => {
    const schema = z.object({ langs: z.array(z.enum(['pt', 'en'])) })
    const result = zodToInternalSchema(schema)
    expect(result.fields[0]).toMatchObject({ kind: 'multi-enum' })
  })

  it('throws on non-object root schema', () => {
    expect(() => zodToInternalSchema(z.string())).toThrow(/root must be z\.object/i)
  })
})
