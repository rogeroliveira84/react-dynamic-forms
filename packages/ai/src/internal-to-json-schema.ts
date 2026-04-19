import type { FieldSpec, InternalSchema, JsonSchema } from '@rogeroliveira84/react-dynamic-forms'

function fieldToJsonSchema(field: FieldSpec): JsonSchema {
  const base: JsonSchema = {}
  if (field.label) base.title = field.label
  if (field.description) base.description = field.description
  if (field.defaultValue !== undefined) base.default = field.defaultValue
  if (field.showIf) (base as JsonSchema & { 'x-rdf-show-if'?: unknown })['x-rdf-show-if'] = field.showIf

  switch (field.kind) {
    case 'text':
    case 'textarea':
    case 'password':
      return {
        ...base,
        type: 'string',
        ...(field.minLength !== undefined ? { minLength: field.minLength } : {}),
        ...(field.maxLength !== undefined ? { maxLength: field.maxLength } : {}),
        ...(field.pattern ? { pattern: field.pattern } : {}),
        ...(field.kind === 'password' ? { format: 'password' } : {}),
      }
    case 'email':
      return { ...base, type: 'string', format: 'email' }
    case 'url':
      return { ...base, type: 'string', format: 'uri' }
    case 'number':
    case 'slider':
      return {
        ...base,
        type: 'number',
        ...(field.min !== undefined ? { minimum: field.min } : {}),
        ...(field.max !== undefined ? { maximum: field.max } : {}),
        ...(field.step !== undefined ? { multipleOf: field.step } : {}),
      }
    case 'boolean':
      return { ...base, type: 'boolean' }
    case 'date':
      return { ...base, type: 'string', format: 'date' }
    case 'datetime':
      return { ...base, type: 'string', format: 'date-time' }
    case 'time':
      return { ...base, type: 'string', format: 'time' }
    case 'enum':
      return { ...base, type: 'string', enum: field.options.map((o) => o.value) }
    case 'multi-enum':
      return {
        ...base,
        type: 'array',
        items: { type: 'string', enum: field.options.map((o) => o.value) },
      }
    case 'array':
      return { ...base, type: 'array', items: fieldToJsonSchema(field.item) }
    case 'object': {
      const properties: Record<string, JsonSchema> = {}
      const required: string[] = []
      for (const f of field.fields) {
        properties[f.name] = fieldToJsonSchema(f)
        if (f.required) required.push(f.name)
      }
      const out: JsonSchema = { ...base, type: 'object', properties }
      if (required.length) out.required = required
      return out
    }
    case 'file': {
      const out: JsonSchema & { 'x-rdf-max-size'?: number; 'x-rdf-multiple'?: boolean } = {
        ...base,
        type: 'string',
        format: 'data-url',
      }
      if (field.accept) out.contentMediaType = field.accept
      if (field.maxSize !== undefined) out['x-rdf-max-size'] = field.maxSize
      if (field.multiple) out['x-rdf-multiple'] = true
      return out
    }
  }
}

export function internalToJsonSchema(schema: InternalSchema): JsonSchema {
  const properties: Record<string, JsonSchema> = {}
  const required: string[] = []
  for (const f of schema.fields) {
    properties[f.name] = fieldToJsonSchema(f)
    if (f.required) required.push(f.name)
  }
  const out: JsonSchema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
    properties,
  }
  if (schema.title) out.title = schema.title
  if (schema.description) out.description = schema.description
  if (required.length) out.required = required
  return out
}
