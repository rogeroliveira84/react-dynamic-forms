import type { ZodTypeAny } from 'zod'
import type { InternalSchema } from '../internal-schema'
import { zodToInternalSchema } from './zod'
import { jsonSchemaToInternalSchema, type JsonSchema } from './json-schema'
import { legacyConfigToInternalSchema, type LegacyConfig } from './legacy'

export type SchemaInput = ZodTypeAny | JsonSchema | LegacyConfig | InternalSchema

function isZod(input: unknown): input is ZodTypeAny {
  return (
    typeof input === 'object' &&
    input !== null &&
    '_def' in (input as object) &&
    'parse' in (input as object)
  )
}

function isLegacy(input: unknown): input is LegacyConfig {
  if (typeof input !== 'object' || input === null) return false
  const obj = input as Record<string, unknown>
  return (
    Array.isArray(obj.fields) &&
    (obj.fields as unknown[]).every(
      (f) => typeof f === 'object' && f !== null && 'id' in (f as object) && 'type' in (f as object),
    )
  )
}

function isJsonSchema(input: unknown): input is JsonSchema {
  if (typeof input !== 'object' || input === null) return false
  const obj = input as Record<string, unknown>
  return obj.type === 'object' || 'properties' in obj || '$schema' in obj
}

function isInternal(input: unknown): input is InternalSchema {
  if (typeof input !== 'object' || input === null) return false
  const obj = input as Record<string, unknown>
  return (
    Array.isArray(obj.fields) &&
    (obj.fields as unknown[]).every(
      (f) => typeof f === 'object' && f !== null && 'kind' in (f as object) && 'name' in (f as object),
    )
  )
}

export function detectAndConvert(input: SchemaInput): InternalSchema {
  if (isZod(input)) return zodToInternalSchema(input)
  if (isInternal(input)) return input
  if (isLegacy(input)) {
    if (typeof console !== 'undefined') {
      console.warn(
        '[react-dynamic-forms] Legacy config format is deprecated. Migrate to Zod or JSON Schema. See https://github.com/rogeroliveira84/react-dynamic-forms/blob/master/docs/migrate-from-v0.md',
      )
    }
    return legacyConfigToInternalSchema(input)
  }
  if (isJsonSchema(input)) return jsonSchemaToInternalSchema(input)
  throw new Error('Unrecognized schema input — expected Zod, JSON Schema, or legacy config.')
}
