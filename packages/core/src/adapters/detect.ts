import type { ZodTypeAny } from 'zod'
import type { InternalSchema } from '../internal-schema'
import { zodToInternalSchema } from './zod'
import { jsonSchemaToInternalSchema, type JsonSchema } from './json-schema'
import { legacyConfigToInternalSchema, type LegacyConfig } from './legacy'
import { isZodLike } from './is-zod'

export type SchemaInput = ZodTypeAny | JsonSchema | LegacyConfig | InternalSchema

function hasFieldsMatching(input: unknown, keys: readonly string[]): boolean {
  if (typeof input !== 'object' || input === null) return false
  const fields = (input as { fields?: unknown }).fields
  if (!Array.isArray(fields)) return false
  return fields.every(
    (f) => typeof f === 'object' && f !== null && keys.every((k) => k in (f as object)),
  )
}

function isLegacy(input: unknown): input is LegacyConfig {
  return hasFieldsMatching(input, ['id', 'type'])
}

function isInternal(input: unknown): input is InternalSchema {
  return hasFieldsMatching(input, ['kind', 'name'])
}

function isJsonSchema(input: unknown): input is JsonSchema {
  if (typeof input !== 'object' || input === null) return false
  const obj = input as Record<string, unknown>
  return obj.type === 'object' || 'properties' in obj || '$schema' in obj
}

export function detectAndConvert(input: SchemaInput): InternalSchema {
  if (isZodLike(input)) return zodToInternalSchema(input)
  if (isInternal(input)) return input
  if (isLegacy(input)) {
    console.warn(
      '[react-dynamic-forms] Legacy config format is deprecated. Migrate to Zod or JSON Schema. See https://github.com/rogeroliveira84/react-dynamic-forms/blob/master/docs/migrate-from-v0.md',
    )
    return legacyConfigToInternalSchema(input)
  }
  if (isJsonSchema(input)) return jsonSchemaToInternalSchema(input)
  throw new Error('Unrecognized schema input — expected Zod, JSON Schema, or legacy config.')
}
