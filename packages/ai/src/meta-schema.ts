import { z } from 'zod'

/**
 * Meta-schema: describes what the LLM should return.
 *
 * We constrain generation to a JSON representation of InternalSchema. The Vercel AI SDK's
 * generateObject validates and retries against this, so malformed output never escapes.
 *
 * Kept flat (one level of nesting for object/array items) for v2 to keep the LLM output
 * deterministic. Deeper nesting can land in v2.1 once we measure real-world quality.
 */
const enumOption = z.object({
  value: z.union([z.string(), z.number()]),
  label: z.string(),
})

const showIfRule = z.object({
  field: z.string(),
  equals: z.union([z.string(), z.number(), z.boolean()]),
})

const baseMeta = {
  name: z.string().describe('Field identifier (camelCase, no spaces).'),
  label: z.string().optional().describe('Human-readable label.'),
  description: z.string().optional().describe('Helper text shown under the field.'),
  placeholder: z.string().optional(),
  required: z.boolean().optional().describe('Default true if missing.'),
  showIf: showIfRule.optional().describe('Render only when another field equals this value.'),
}

const leafFieldSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('text'),
    ...baseMeta,
    minLength: z.number().int().nonnegative().optional(),
    maxLength: z.number().int().positive().optional(),
    pattern: z.string().optional(),
  }),
  z.object({ kind: z.literal('email'), ...baseMeta }),
  z.object({ kind: z.literal('password'), ...baseMeta }),
  z.object({ kind: z.literal('url'), ...baseMeta }),
  z.object({ kind: z.literal('textarea'), ...baseMeta, maxLength: z.number().int().positive().optional() }),
  z.object({
    kind: z.literal('number'),
    ...baseMeta,
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().optional(),
  }),
  z.object({
    kind: z.literal('slider'),
    ...baseMeta,
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().optional(),
  }),
  z.object({ kind: z.literal('boolean'), ...baseMeta }),
  z.object({ kind: z.literal('date'), ...baseMeta }),
  z.object({ kind: z.literal('datetime'), ...baseMeta }),
  z.object({ kind: z.literal('time'), ...baseMeta }),
  z.object({ kind: z.literal('enum'), ...baseMeta, options: z.array(enumOption).min(1) }),
  z.object({ kind: z.literal('multi-enum'), ...baseMeta, options: z.array(enumOption).min(1) }),
  z.object({
    kind: z.literal('file'),
    ...baseMeta,
    accept: z.string().optional(),
    maxSize: z.number().int().positive().optional(),
    multiple: z.boolean().optional(),
  }),
])

// One level of nesting: object fields can contain leaf fields, array items are leaf fields.
const objectOrArrayFieldSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('object'),
    ...baseMeta,
    fields: z.array(leafFieldSchema).min(1),
  }),
  z.object({
    kind: z.literal('array'),
    ...baseMeta,
    item: leafFieldSchema,
    minItems: z.number().int().nonnegative().optional(),
    maxItems: z.number().int().positive().optional(),
  }),
])

export const metaFieldSchema = z.union([leafFieldSchema, objectOrArrayFieldSchema])

export const metaInternalSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  fields: z.array(metaFieldSchema).min(1).max(30),
})

export type MetaInternalSchema = z.infer<typeof metaInternalSchema>
