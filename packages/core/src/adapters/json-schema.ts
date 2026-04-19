import type { FieldSpec, InternalSchema, EnumOption } from '../internal-schema'

export type JsonSchema = {
  type?: string | string[]
  properties?: Record<string, JsonSchema>
  required?: string[]
  items?: JsonSchema
  enum?: (string | number)[]
  format?: string
  minimum?: number
  maximum?: number
  minLength?: number
  maxLength?: number
  multipleOf?: number
  pattern?: string
  description?: string
  title?: string
  default?: unknown
  $schema?: string
}

function jsonFieldFromSchema(name: string, schema: JsonSchema, required: boolean): FieldSpec {
  const extras: { description?: string; label?: string; defaultValue?: unknown } = {}
  if (schema.description) extras.description = schema.description
  if (schema.title) extras.label = schema.title
  if (schema.default !== undefined) extras.defaultValue = schema.default
  const base = { name, required, ...extras }

  if (schema.enum) {
    const options: EnumOption[] = schema.enum.map((v) => ({ value: v, label: String(v) }))
    return { ...base, kind: 'enum', options }
  }

  const type = Array.isArray(schema.type) ? schema.type[0] : schema.type

  if (type === 'string') {
    const fmt = schema.format
    if (fmt === 'email') return { ...base, kind: 'email' }
    if (fmt === 'uri' || fmt === 'url') return { ...base, kind: 'url' }
    if (fmt === 'date') return { ...base, kind: 'date' }
    if (fmt === 'date-time') return { ...base, kind: 'datetime' }
    if (fmt === 'time') return { ...base, kind: 'time' }
    if (fmt === 'password') return { ...base, kind: 'password' }
    const strExtras: { minLength?: number; maxLength?: number; pattern?: string } = {}
    if (schema.minLength !== undefined) strExtras.minLength = schema.minLength
    if (schema.maxLength !== undefined) strExtras.maxLength = schema.maxLength
    if (schema.pattern) strExtras.pattern = schema.pattern
    return { ...base, kind: 'text', ...strExtras }
  }
  if (type === 'number' || type === 'integer') {
    const numExtras: { min?: number; max?: number; step?: number } = {}
    if (schema.minimum !== undefined) numExtras.min = schema.minimum
    if (schema.maximum !== undefined) numExtras.max = schema.maximum
    if (schema.multipleOf !== undefined) numExtras.step = schema.multipleOf
    return { ...base, kind: 'number', ...numExtras }
  }
  if (type === 'boolean') {
    return { ...base, kind: 'boolean' }
  }
  if (type === 'array') {
    const items = schema.items ?? { type: 'string' }
    if (items.enum) {
      return {
        ...base,
        kind: 'multi-enum',
        options: items.enum.map((v) => ({ value: v, label: String(v) })),
      }
    }
    return { ...base, kind: 'array', item: jsonFieldFromSchema(`${name}Item`, items, true) }
  }
  if (type === 'object') {
    const props = schema.properties ?? {}
    const req = new Set(schema.required ?? [])
    return {
      ...base,
      kind: 'object',
      fields: Object.entries(props).map(([k, v]) => jsonFieldFromSchema(k, v, req.has(k))),
    }
  }

  return { ...base, kind: 'text' }
}

export function jsonSchemaToInternalSchema(schema: JsonSchema): InternalSchema {
  const type = Array.isArray(schema.type) ? schema.type[0] : schema.type
  if (type !== 'object' && !schema.properties) {
    throw new Error('JSON Schema root must be an object with properties')
  }
  const props = schema.properties ?? {}
  const req = new Set(schema.required ?? [])
  const extras: { title?: string; description?: string } = {}
  if (schema.title) extras.title = schema.title
  if (schema.description) extras.description = schema.description
  return {
    ...extras,
    fields: Object.entries(props).map(([k, v]) => jsonFieldFromSchema(k, v, req.has(k))),
  }
}
