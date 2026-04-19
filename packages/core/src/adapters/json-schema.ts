import type { FieldSpec, InternalSchema, EnumOption, ShowIfRule } from '../internal-schema'
import { buildBase, numberExtras, stringExtras } from './_shared'

export type JsonSchema = {
  type?: string | readonly string[]
  properties?: Readonly<Record<string, JsonSchema>>
  required?: readonly string[]
  items?: JsonSchema
  enum?: readonly (string | number)[]
  format?: string
  contentMediaType?: string
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
  'x-rdf-show-if'?: ShowIfRule
  'x-rdf-max-size'?: number
  'x-rdf-multiple'?: boolean
}

function jsonFieldFromSchema(name: string, schema: JsonSchema, required: boolean): FieldSpec {
  const base = buildBase({
    name,
    required,
    ...(schema.title ? { label: schema.title } : {}),
    ...(schema.description ? { description: schema.description } : {}),
    ...(schema.default !== undefined ? { defaultValue: schema.default } : {}),
  })
  if (schema['x-rdf-show-if']) base.showIf = schema['x-rdf-show-if']

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
    if (fmt === 'data-url' || fmt === 'binary' || schema.contentMediaType) {
      const file: FieldSpec = { ...base, kind: 'file' }
      if (schema.contentMediaType) file.accept = schema.contentMediaType
      if (schema['x-rdf-max-size']) file.maxSize = schema['x-rdf-max-size']
      if (schema['x-rdf-multiple']) file.multiple = schema['x-rdf-multiple']
      return file
    }
    return {
      ...base,
      kind: 'text',
      ...stringExtras({
        minLength: schema.minLength,
        maxLength: schema.maxLength,
        pattern: schema.pattern,
      }),
    }
  }
  if (type === 'number' || type === 'integer') {
    return {
      ...base,
      kind: 'number',
      ...numberExtras({ min: schema.minimum, max: schema.maximum, step: schema.multipleOf }),
    }
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
  const out: InternalSchema = {
    fields: Object.entries(props).map(([k, v]) => jsonFieldFromSchema(k, v, req.has(k))),
  }
  if (schema.title) out.title = schema.title
  if (schema.description) out.description = schema.description
  return out
}
