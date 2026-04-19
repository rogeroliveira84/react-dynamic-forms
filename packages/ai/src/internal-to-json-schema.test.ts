import { describe, it, expect } from 'vitest'
import { internalToJsonSchema } from './internal-to-json-schema'

describe('internalToJsonSchema', () => {
  it('emits a valid Draft 2020-12 object schema', () => {
    const js = internalToJsonSchema({
      fields: [{ kind: 'text', name: 'name', required: true }],
    })
    expect(js.$schema).toBe('https://json-schema.org/draft/2020-12/schema')
    expect(js.type).toBe('object')
    expect(js.properties?.name).toMatchObject({ type: 'string' })
    expect(js.required).toEqual(['name'])
  })

  it('emits email / url / date formats', () => {
    const js = internalToJsonSchema({
      fields: [
        { kind: 'email', name: 'e', required: true },
        { kind: 'url', name: 'u', required: true },
        { kind: 'date', name: 'd', required: true },
      ],
    })
    expect(js.properties?.e).toMatchObject({ format: 'email' })
    expect(js.properties?.u).toMatchObject({ format: 'uri' })
    expect(js.properties?.d).toMatchObject({ format: 'date' })
  })

  it('emits number with bounds', () => {
    const js = internalToJsonSchema({
      fields: [{ kind: 'number', name: 'age', required: true, min: 18, max: 120 }],
    })
    expect(js.properties?.age).toMatchObject({ type: 'number', minimum: 18, maximum: 120 })
  })

  it('emits enum as type+enum', () => {
    const js = internalToJsonSchema({
      fields: [
        {
          kind: 'enum',
          name: 'c',
          required: true,
          options: [
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ],
        },
      ],
    })
    expect(js.properties?.c).toMatchObject({ type: 'string', enum: ['a', 'b'] })
  })

  it('emits file with data-url format + contentMediaType', () => {
    const js = internalToJsonSchema({
      fields: [{ kind: 'file', name: 'pic', required: true, accept: 'image/*' }],
    })
    expect(js.properties?.pic).toMatchObject({
      type: 'string',
      format: 'data-url',
      contentMediaType: 'image/*',
    })
  })

  it('preserves showIf as x-rdf-show-if', () => {
    const js = internalToJsonSchema({
      fields: [
        { kind: 'text', name: 'a', required: true },
        { kind: 'text', name: 'b', required: false, showIf: { field: 'a', equals: 'yes' } },
      ],
    })
    expect(js.properties?.b).toMatchObject({
      'x-rdf-show-if': { field: 'a', equals: 'yes' },
    })
  })
})
