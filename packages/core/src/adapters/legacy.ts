import type { FieldSpec, InternalSchema, EnumOption } from '../internal-schema'
import { buildBase, numberExtras } from './_shared'

export type LegacyOption = { id: string | number; display: string }

export type LegacyDefinition = {
  options?: LegacyOption[]
  min?: string | number
  max?: string | number
  step?: string | number
  maxlength?: string | number
}

export type LegacyField = {
  id: string
  label: string
  description?: string
  type: 'text' | 'date' | 'datetime-local' | 'time' | 'number' | 'checkbox' | 'array' | 'multi-array'
  value: unknown
  required: 'true' | 'false' | boolean
  placeholder?: string
  defaultValue?: unknown
  definition?: LegacyDefinition
}

export type LegacyConfig = { name: string; fields: LegacyField[] }

const toNum = (v: string | number | undefined): number | undefined =>
  v === undefined ? undefined : typeof v === 'number' ? v : Number(v)

function legacyFieldToFieldSpec(f: LegacyField): FieldSpec {
  const required = f.required === true || f.required === 'true'
  const base = buildBase({
    name: f.id,
    required,
    label: f.label,
    ...(f.description ? { description: f.description } : {}),
    ...(f.placeholder ? { placeholder: f.placeholder } : {}),
    ...(f.defaultValue !== undefined && f.defaultValue !== '' ? { defaultValue: f.defaultValue } : {}),
  })
  const def = f.definition ?? {}

  switch (f.type) {
    case 'text':
      return {
        ...base,
        kind: 'text',
        ...(def.maxlength !== undefined ? { maxLength: Number(def.maxlength) } : {}),
      }
    case 'number':
      return {
        ...base,
        kind: 'number',
        ...numberExtras({ min: toNum(def.min), max: toNum(def.max), step: toNum(def.step) }),
      }
    case 'date':
      return { ...base, kind: 'date' }
    case 'datetime-local':
      return { ...base, kind: 'datetime' }
    case 'time':
      return { ...base, kind: 'time' }
    case 'checkbox':
      return { ...base, kind: 'boolean' }
    case 'array': {
      const opts: EnumOption[] = (def.options ?? []).map((o) => ({ value: o.id, label: o.display }))
      return { ...base, kind: 'enum', options: opts }
    }
    case 'multi-array': {
      const opts: EnumOption[] = (def.options ?? []).map((o) => ({ value: o.id, label: o.display }))
      return { ...base, kind: 'multi-enum', options: opts }
    }
    default:
      return { ...base, kind: 'text' }
  }
}

export function legacyConfigToInternalSchema(cfg: LegacyConfig): InternalSchema {
  const out: InternalSchema = { fields: cfg.fields.map(legacyFieldToFieldSpec) }
  if (cfg.name) out.title = cfg.name
  return out
}
