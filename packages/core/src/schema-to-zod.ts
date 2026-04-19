import { z, type ZodTypeAny } from 'zod'
import type { FieldSpec, InternalSchema } from './internal-schema'

function enumUnion(values: ZodTypeAny[]): ZodTypeAny {
  if (values.length === 0) return z.never()
  if (values.length === 1) return values[0] as ZodTypeAny
  const [first, second, ...rest] = values as [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]
  return z.union([first, second, ...rest])
}

function fieldToZod(f: FieldSpec): ZodTypeAny {
  let s: ZodTypeAny
  switch (f.kind) {
    case 'text':
    case 'textarea':
    case 'password': {
      let str = z.string()
      if (f.minLength !== undefined) str = str.min(f.minLength)
      if (f.maxLength !== undefined) str = str.max(f.maxLength)
      if (f.pattern) str = str.regex(new RegExp(f.pattern))
      s = str
      break
    }
    case 'email':
      s = z.string().email()
      break
    case 'url':
      s = z.string().url()
      break
    case 'number':
    case 'slider': {
      let num = z.number()
      if (f.min !== undefined) num = num.min(f.min)
      if (f.max !== undefined) num = num.max(f.max)
      s = num
      break
    }
    case 'boolean':
      s = z.boolean()
      break
    case 'date':
    case 'datetime':
      s = z.coerce.date()
      break
    case 'time':
      s = z.string()
      break
    case 'enum': {
      const values: ZodTypeAny[] = f.options.map((o) => z.literal(o.value))
      s = enumUnion(values)
      break
    }
    case 'multi-enum': {
      const values: ZodTypeAny[] = f.options.map((o) => z.literal(o.value))
      s = z.array(enumUnion(values))
      break
    }
    case 'array':
      s = z.array(fieldToZod(f.item))
      break
    case 'object':
      s = internalToZod({ fields: f.fields })
      break
    case 'file': {
      let file = z.custom<File>((v) => typeof File !== 'undefined' && v instanceof File, {
        message: 'Expected a File',
      })
      if (f.maxSize !== undefined) {
        const max = f.maxSize
        file = file.refine((v: File) => v.size <= max, {
          message: `File exceeds max size of ${max} bytes`,
        })
      }
      s = f.multiple ? z.array(file) : file
      break
    }
  }
  if (!f.required) s = s.optional()
  if (f.description) s = s.describe(f.description)
  return s
}

export function internalToZod(schema: InternalSchema): ZodTypeAny {
  const shape: Record<string, ZodTypeAny> = {}
  for (const f of schema.fields) shape[f.name] = fieldToZod(f)
  return z.object(shape)
}
