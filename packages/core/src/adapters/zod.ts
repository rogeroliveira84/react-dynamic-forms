import { z, type ZodTypeAny, type ZodObject, type ZodRawShape } from 'zod'
import type { FieldSpec, InternalSchema, EnumOption } from '../internal-schema'
import { buildBase, numberExtras, stringExtras } from './_shared'

type UnwrapResult = { schema: ZodTypeAny; required: boolean; description?: string }

function unwrap(schema: ZodTypeAny): UnwrapResult {
  let current = schema
  let required = true
  let description = schema.description

  while (
    current instanceof z.ZodOptional ||
    current instanceof z.ZodNullable ||
    current instanceof z.ZodDefault ||
    current instanceof z.ZodEffects
  ) {
    if (current instanceof z.ZodOptional || current instanceof z.ZodNullable) required = false
    current =
      current instanceof z.ZodEffects ? current._def.schema : current._def.innerType
    if (!description) description = current.description
  }

  return description === undefined ? { schema: current, required } : { schema: current, required, description }
}

function stringKindAndChecks(schema: z.ZodString): {
  kind: 'text' | 'email' | 'url'
  minLength?: number
  maxLength?: number
} {
  const checks = schema._def.checks ?? []
  let kind: 'text' | 'email' | 'url' = 'text'
  let minLength: number | undefined
  let maxLength: number | undefined
  for (const c of checks) {
    if (c.kind === 'email') kind = 'email'
    else if (c.kind === 'url') kind = 'url'
    else if (c.kind === 'min') minLength = c.value
    else if (c.kind === 'max') maxLength = c.value
  }
  return { kind, minLength, maxLength }
}

function zodNumberChecks(schema: z.ZodNumber): { min?: number; max?: number; step?: number } {
  const checks = schema._def.checks ?? []
  let min: number | undefined
  let max: number | undefined
  let step: number | undefined
  for (const c of checks) {
    if (c.kind === 'min') min = c.value
    else if (c.kind === 'max') max = c.value
    else if (c.kind === 'multipleOf') step = c.value
  }
  return { min, max, step }
}

function fieldFromZod(name: string, zodField: ZodTypeAny): FieldSpec {
  const { schema, required, description } = unwrap(zodField)
  const base = buildBase({ name, required, ...(description ? { description } : {}) })

  if (schema instanceof z.ZodString) {
    const { kind, minLength, maxLength } = stringKindAndChecks(schema)
    return { ...base, kind, ...stringExtras({ minLength, maxLength }) }
  }
  if (schema instanceof z.ZodNumber) {
    return { ...base, kind: 'number', ...numberExtras(zodNumberChecks(schema)) }
  }
  if (schema instanceof z.ZodBoolean) return { ...base, kind: 'boolean' }
  if (schema instanceof z.ZodDate) return { ...base, kind: 'date' }

  if (schema instanceof z.ZodEnum) {
    const values = schema._def.values as readonly (string | number)[]
    const options: EnumOption[] = values.map((v) => ({ value: v, label: String(v) }))
    return { ...base, kind: 'enum', options }
  }
  if (schema instanceof z.ZodNativeEnum) {
    const values = Object.values(schema._def.values as Record<string, string | number>)
    const options: EnumOption[] = values.map((v) => ({ value: v, label: String(v) }))
    return { ...base, kind: 'enum', options }
  }
  if (schema instanceof z.ZodArray) {
    const inner = unwrap(schema._def.type).schema
    if (inner instanceof z.ZodEnum) {
      const values = inner._def.values as readonly (string | number)[]
      return {
        ...base,
        kind: 'multi-enum',
        options: values.map((v) => ({ value: v, label: String(v) })),
      }
    }
    return { ...base, kind: 'array', item: fieldFromZod(`${name}Item`, schema._def.type) }
  }
  if (schema instanceof z.ZodObject) {
    const objSchema = schema as ZodObject<ZodRawShape>
    const shape = objSchema._def.shape()
    return {
      ...base,
      kind: 'object',
      fields: Object.entries(shape).map(([k, v]) => fieldFromZod(k, v as ZodTypeAny)),
    }
  }

  return { ...base, kind: 'text' }
}

export function zodToInternalSchema(schema: ZodTypeAny): InternalSchema {
  const root = unwrap(schema).schema
  if (!(root instanceof z.ZodObject)) {
    throw new Error('Zod root must be z.object(...) for DynamicForm')
  }
  const shape = (root as ZodObject<ZodRawShape>)._def.shape()
  return {
    fields: Object.entries(shape).map(([name, field]) => fieldFromZod(name, field as ZodTypeAny)),
  }
}
