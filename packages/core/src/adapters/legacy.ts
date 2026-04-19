import type { FieldSpec, InternalSchema, EnumOption } from '../internal-schema'

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
  const extras: { description?: string; placeholder?: string; defaultValue?: unknown } = {}
  if (f.description) extras.description = f.description
  if (f.placeholder) extras.placeholder = f.placeholder
  if (f.defaultValue !== undefined && f.defaultValue !== '') extras.defaultValue = f.defaultValue
  const base = { name: f.id, label: f.label, required, ...extras }
  const def = f.definition ?? {}

  switch (f.type) {
    case 'text': {
      const strExtras: { maxLength?: number } = {}
      if (def.maxlength !== undefined) strExtras.maxLength = Number(def.maxlength)
      return { ...base, kind: 'text', ...strExtras }
    }
    case 'number': {
      const numExtras: { min?: number; max?: number; step?: number } = {}
      if (def.min !== undefined) numExtras.min = toNum(def.min) ?? 0
      if (def.max !== undefined) numExtras.max = toNum(def.max) ?? 0
      if (def.step !== undefined) numExtras.step = toNum(def.step) ?? 1
      return { ...base, kind: 'number', ...numExtras }
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
  const extras: { title?: string } = {}
  if (cfg.name) extras.title = cfg.name
  return {
    ...extras,
    fields: cfg.fields.map(legacyFieldToFieldSpec),
  }
}
