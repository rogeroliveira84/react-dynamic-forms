import type { FieldSpec, InternalSchema } from '@rogeroliveira84/react-dynamic-forms'

function quote(value: string | number | boolean): string {
  if (typeof value === 'string') return JSON.stringify(value)
  return String(value)
}

function describeChain(chain: string, field: FieldSpec): string {
  let out = chain
  if (field.description) out += `.describe(${JSON.stringify(field.description)})`
  return out
}

function emitField(field: FieldSpec): string {
  let expr: string
  switch (field.kind) {
    case 'text':
    case 'textarea':
    case 'password': {
      expr = 'z.string()'
      if (field.minLength !== undefined) expr += `.min(${field.minLength})`
      if (field.maxLength !== undefined) expr += `.max(${field.maxLength})`
      if (field.pattern) expr += `.regex(new RegExp(${JSON.stringify(field.pattern)}))`
      break
    }
    case 'email':
      expr = 'z.string().email()'
      break
    case 'url':
      expr = 'z.string().url()'
      break
    case 'number':
    case 'slider': {
      expr = 'z.number()'
      if (field.min !== undefined) expr += `.min(${field.min})`
      if (field.max !== undefined) expr += `.max(${field.max})`
      break
    }
    case 'boolean':
      expr = 'z.boolean()'
      break
    case 'date':
    case 'datetime':
      expr = 'z.coerce.date()'
      break
    case 'time':
      expr = 'z.string()'
      break
    case 'enum': {
      const parts = field.options.map((o) => `z.literal(${quote(o.value)})`).join(', ')
      expr = field.options.length >= 2 ? `z.union([${parts}])` : parts
      break
    }
    case 'multi-enum': {
      const parts = field.options.map((o) => `z.literal(${quote(o.value)})`).join(', ')
      const inner = field.options.length >= 2 ? `z.union([${parts}])` : parts
      expr = `z.array(${inner})`
      break
    }
    case 'array':
      expr = `z.array(${emitField(field.item)})`
      break
    case 'object': {
      const entries = field.fields.map((f) => `  ${f.name}: ${emitField(f)},`).join('\n')
      expr = `z.object({\n${entries}\n})`
      break
    }
    case 'file': {
      let file = `z.custom<File>((v) => typeof File !== 'undefined' && v instanceof File)`
      if (field.maxSize !== undefined) {
        file += `.refine((f) => (f as File).size <= ${field.maxSize}, { message: 'File too large' })`
      }
      expr = field.multiple ? `z.array(${file})` : file
      break
    }
  }
  if (!field.required) expr += '.optional()'
  return describeChain(expr, field)
}

export function emitZodCode(schema: InternalSchema): string {
  const entries = schema.fields.map((f) => `  ${f.name}: ${emitField(f)},`).join('\n')
  const header = "import { z } from 'zod'\n"
  const banner = schema.title ? `// ${schema.title}${schema.description ? ` — ${schema.description}` : ''}\n` : ''
  return `${header}\n${banner}export const schema = z.object({\n${entries}\n})\n`
}
