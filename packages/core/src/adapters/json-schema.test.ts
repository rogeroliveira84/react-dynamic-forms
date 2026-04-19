import { describe, it, expect } from 'vitest'
import { jsonSchemaToInternalSchema } from './json-schema'
import type { ObjectFieldSpec } from '../internal-schema'

describe('jsonSchemaToInternalSchema', () => {
  it('converts string property to text', () => {
    const result = jsonSchemaToInternalSchema({
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name'],
    })
    expect(result.fields[0]).toMatchObject({ kind: 'text', name: 'name', required: true })
  })

  it('detects email format', () => {
    const result = jsonSchemaToInternalSchema({
      type: 'object',
      properties: { mail: { type: 'string', format: 'email' } },
    })
    expect(result.fields[0]).toMatchObject({ kind: 'email' })
  })

  it('detects date format', () => {
    const result = jsonSchemaToInternalSchema({
      type: 'object',
      properties: { dob: { type: 'string', format: 'date' } },
    })
    expect(result.fields[0]).toMatchObject({ kind: 'date' })
  })

  it('converts number with min/max', () => {
    const result = jsonSchemaToInternalSchema({
      type: 'object',
      properties: { age: { type: 'number', minimum: 18, maximum: 120 } },
    })
    expect(result.fields[0]).toMatchObject({ kind: 'number', min: 18, max: 120 })
  })

  it('converts enum to enum kind', () => {
    const result = jsonSchemaToInternalSchema({
      type: 'object',
      properties: { country: { type: 'string', enum: ['BR', 'US'] } },
    })
    expect(result.fields[0]).toMatchObject({
      kind: 'enum',
      options: [
        { value: 'BR', label: 'BR' },
        { value: 'US', label: 'US' },
      ],
    })
  })

  it('uses description', () => {
    const result = jsonSchemaToInternalSchema({
      type: 'object',
      properties: { name: { type: 'string', description: 'Full name' } },
    })
    expect(result.fields[0]).toMatchObject({ description: 'Full name' })
  })

  it('marks fields not in required array as optional', () => {
    const result = jsonSchemaToInternalSchema({
      type: 'object',
      properties: { nick: { type: 'string' } },
      required: [],
    })
    expect(result.fields[0]).toMatchObject({ required: false })
  })

  it('converts nested object', () => {
    const result = jsonSchemaToInternalSchema({
      type: 'object',
      properties: {
        addr: {
          type: 'object',
          properties: { city: { type: 'string' } },
          required: ['city'],
        },
      },
    })
    const first = result.fields[0] as ObjectFieldSpec
    expect(first).toMatchObject({ kind: 'object' })
    expect(first.fields[0]).toMatchObject({ kind: 'text', name: 'city' })
  })

  it('converts array with items', () => {
    const result = jsonSchemaToInternalSchema({
      type: 'object',
      properties: { tags: { type: 'array', items: { type: 'string' } } },
    })
    expect(result.fields[0]).toMatchObject({ kind: 'array' })
  })

  it('throws on non-object root', () => {
    expect(() => jsonSchemaToInternalSchema({ type: 'string' })).toThrow(/root must be an object/i)
  })
})
