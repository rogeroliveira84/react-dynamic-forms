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

  it('detects file via format: data-url', () => {
    const result = jsonSchemaToInternalSchema({
      type: 'object',
      properties: { avatar: { type: 'string', format: 'data-url' } },
    })
    expect(result.fields[0]).toMatchObject({ kind: 'file' })
  })

  it('detects file via contentMediaType and passes accept', () => {
    const result = jsonSchemaToInternalSchema({
      type: 'object',
      properties: { upload: { type: 'string', contentMediaType: 'image/*' } },
    })
    expect(result.fields[0]).toMatchObject({ kind: 'file', accept: 'image/*' })
  })

  it('reads x-rdf-show-if onto showIf', () => {
    const result = jsonSchemaToInternalSchema({
      type: 'object',
      properties: {
        maybeShown: {
          type: 'string',
          'x-rdf-show-if': { field: 'guard', equals: true },
        },
      },
    })
    expect(result.fields[0]).toMatchObject({
      showIf: { field: 'guard', equals: true },
    })
  })

  it('reads x-rdf-max-size and x-rdf-multiple on file', () => {
    const result = jsonSchemaToInternalSchema({
      type: 'object',
      properties: {
        pic: {
          type: 'string',
          format: 'data-url',
          'x-rdf-max-size': 1024,
          'x-rdf-multiple': true,
        },
      },
    })
    expect(result.fields[0]).toMatchObject({
      kind: 'file',
      maxSize: 1024,
      multiple: true,
    })
  })
})
