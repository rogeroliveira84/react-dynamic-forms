import { describe, it, expect } from 'vitest'
import { legacyConfigToInternalSchema, type LegacyConfig } from './legacy'

describe('legacyConfigToInternalSchema', () => {
  it('converts v0.5 text field', () => {
    const cfg: LegacyConfig = {
      name: 'Form',
      fields: [{ id: 'name', label: 'Full Name', type: 'text', required: 'true', value: '' }],
    }
    const res = legacyConfigToInternalSchema(cfg)
    expect(res.fields[0]).toMatchObject({
      kind: 'text',
      name: 'name',
      label: 'Full Name',
      required: true,
    })
  })

  it('converts string "true"/"false" required to boolean', () => {
    const cfg: LegacyConfig = {
      name: 'Form',
      fields: [{ id: 'a', label: 'A', type: 'text', required: 'false', value: '' }],
    }
    expect(legacyConfigToInternalSchema(cfg).fields[0]).toMatchObject({ required: false })
  })

  it('maps v0.5 array type to enum', () => {
    const cfg: LegacyConfig = {
      name: 'Form',
      fields: [
        {
          id: 'country',
          label: 'Country',
          type: 'array',
          required: 'false',
          value: '',
          definition: {
            options: [
              { id: 'br', display: 'Brazil' },
              { id: 'us', display: 'US' },
            ],
          },
        },
      ],
    }
    expect(legacyConfigToInternalSchema(cfg).fields[0]).toMatchObject({
      kind: 'enum',
      options: [
        { value: 'br', label: 'Brazil' },
        { value: 'us', label: 'US' },
      ],
    })
  })

  it('maps v0.5 multi-array to multi-enum', () => {
    const cfg: LegacyConfig = {
      name: 'Form',
      fields: [
        {
          id: 'cities',
          label: 'Cities',
          type: 'multi-array',
          required: 'false',
          value: [],
          definition: { options: [{ id: 'poa', display: 'Porto Alegre' }] },
        },
      ],
    }
    expect(legacyConfigToInternalSchema(cfg).fields[0]).toMatchObject({ kind: 'multi-enum' })
  })

  it('maps datetime-local to datetime', () => {
    const cfg: LegacyConfig = {
      name: 'Form',
      fields: [{ id: 'dt', label: 'DT', type: 'datetime-local', required: 'false', value: '' }],
    }
    expect(legacyConfigToInternalSchema(cfg).fields[0]).toMatchObject({ kind: 'datetime' })
  })

  it('maps number with definition.min/max/step', () => {
    const cfg: LegacyConfig = {
      name: 'Form',
      fields: [
        {
          id: 'n',
          label: 'N',
          type: 'number',
          required: 'false',
          value: '',
          definition: { min: '0', max: '100', step: '1' },
        },
      ],
    }
    expect(legacyConfigToInternalSchema(cfg).fields[0]).toMatchObject({
      kind: 'number',
      min: 0,
      max: 100,
      step: 1,
    })
  })
})
