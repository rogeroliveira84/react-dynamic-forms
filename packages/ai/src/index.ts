import { generateObject, type LanguageModelV1 } from 'ai'
import type { InternalSchema, JsonSchema } from '@rogeroliveira84/react-dynamic-forms'
import { metaInternalSchema } from './meta-schema'
import { emitZodCode } from './emit-zod'
import { internalToJsonSchema } from './internal-to-json-schema'

export { emitZodCode } from './emit-zod'
export { internalToJsonSchema } from './internal-to-json-schema'
export type { MetaInternalSchema } from './meta-schema'

type TextInput = { from: 'text'; prompt: string }
type TypescriptInput = { from: 'typescript'; source: string }
type JsonSampleInput = { from: 'json-sample'; sample: unknown; hint?: string }

export type GenerateInput = TextInput | TypescriptInput | JsonSampleInput

export type GenerateOptions = GenerateInput & {
  model: LanguageModelV1
  maxFields?: number
  system?: string
}

export type GenerateResult = {
  internalSchema: InternalSchema
  zodCode: string
  jsonSchema: JsonSchema
}

const DEFAULT_SYSTEM = `You are a world-class form designer. You output form schemas as structured JSON.
Rules:
- Use camelCase for field names.
- Pick the most specific field kind (e.g. 'email' over 'text' when obvious, 'enum' when options are fixed, 'slider' for ranges).
- Prefer short, clear labels; include 'description' only when the label alone isn't self-explanatory.
- Mark fields as required unless the concept is clearly optional (e.g. "middle name", "company/optional").
- Keep forms focused — no more than the requested/implied field count.
- For enums, generate 2–8 realistic options with stable 'value' identifiers.
- Use 'showIf' to make follow-up fields conditional when the domain calls for it.`

function userPrompt(input: GenerateInput, maxFields: number): string {
  const ceiling = `Generate at most ${maxFields} fields. Omit fields that aren't clearly needed.`
  switch (input.from) {
    case 'text':
      return `Describe a form for this requirement:\n\n"""\n${input.prompt}\n"""\n\n${ceiling}`
    case 'typescript':
      return `Generate a form whose fields mirror this TypeScript type (one field per property, map types to the best field kind):\n\n\`\`\`ts\n${input.source}\n\`\`\`\n\n${ceiling}`
    case 'json-sample':
      return `Generate a form that could produce data shaped like this JSON sample (infer field kinds from value types)${input.hint ? `, context: ${input.hint}` : ''}:\n\n\`\`\`json\n${JSON.stringify(input.sample, null, 2)}\n\`\`\`\n\n${ceiling}`
  }
}

export async function generateSchema(options: GenerateOptions): Promise<GenerateResult> {
  const maxFields = options.maxFields ?? 20
  const system = options.system ?? DEFAULT_SYSTEM

  const { object } = await generateObject({
    model: options.model,
    schema: metaInternalSchema,
    system,
    prompt: userPrompt(options, maxFields),
  })

  const internalSchema = object as InternalSchema
  const zodCode = emitZodCode(internalSchema)
  const jsonSchema = internalToJsonSchema(internalSchema)

  return { internalSchema, zodCode, jsonSchema }
}
