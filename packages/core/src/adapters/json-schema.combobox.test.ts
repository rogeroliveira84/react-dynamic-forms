import { describe, it, expect } from 'vitest'
import { jsonSchemaToInternalSchema } from './json-schema'

describe('json-schema combobox', () => {
  it('maps an x-rdf-combobox string with enum to combobox kind + options', () => {
    const res = jsonSchemaToInternalSchema({
      type: 'object',
      properties: {
        city: { type: 'string', enum: ['NY', 'LA'], 'x-rdf-combobox': true },
      },
    })
    expect(res.fields[0]).toMatchObject({
      kind: 'combobox',
      name: 'city',
      options: [
        { value: 'NY', label: 'NY' },
        { value: 'LA', label: 'LA' },
      ],
    })
  })

  it('maps an x-rdf-combobox string without enum to combobox without options', () => {
    const res = jsonSchemaToInternalSchema({
      type: 'object',
      properties: { city: { type: 'string', 'x-rdf-combobox': true } },
    })
    expect(res.fields[0]).toMatchObject({ kind: 'combobox', name: 'city' })
    expect((res.fields[0] as { options?: unknown }).options).toBeUndefined()
  })
})
