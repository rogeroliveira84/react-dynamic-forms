# @rogeroliveira84/react-dynamic-forms-ai

> 🤖 **Prompt → Zod schema → rendered form.** AI-powered schema generation for [`@rogeroliveira84/react-dynamic-forms`](../../README.md), built on the [Vercel AI SDK](https://sdk.vercel.ai).

## Install

```bash
pnpm add @rogeroliveira84/react-dynamic-forms-ai ai @ai-sdk/anthropic zod
```

You bring your own model — swap `@ai-sdk/anthropic` for `@ai-sdk/openai`, `@ai-sdk/google`, or any `LanguageModelV1`-compatible provider.

## Quick start

```ts
import { generateSchema } from '@rogeroliveira84/react-dynamic-forms-ai'
import { anthropic } from '@ai-sdk/anthropic'

const { internalSchema, zodCode, jsonSchema } = await generateSchema({
  from: 'text',
  prompt: 'A job application form for software engineers with experience, skills and portfolio link.',
  model: anthropic('claude-sonnet-4-6'),
})

console.log(zodCode)
// import { z } from 'zod'
//
// export const schema = z.object({
//   fullName: z.string().describe("Applicant's full name"),
//   email: z.string().email(),
//   yearsExperience: z.number().min(0),
//   skills: z.array(z.union([...])),
//   portfolio: z.string().url().optional(),
// })
```

## Input modes

```ts
// Natural language
await generateSchema({ from: 'text', prompt: '...', model })

// TypeScript interface
await generateSchema({
  from: 'typescript',
  source: `interface User { email: string; age: number; }`,
  model,
})

// JSON sample
await generateSchema({
  from: 'json-sample',
  sample: { name: 'Ada', role: 'Engineer', yearsAtCompany: 5 },
  hint: 'employee profile',
  model,
})
```

## Output

```ts
type GenerateResult = {
  internalSchema: InternalSchema  // Feed directly into <DynamicForm schema={...} />
  zodCode: string                 // Ready-to-paste Zod source
  jsonSchema: JsonSchema          // Draft 2020-12 (for DB persistence, OpenAPI, etc.)
}
```

## Render immediately

```tsx
import { DynamicForm } from '@rogeroliveira84/react-dynamic-forms-ui'
import '@rogeroliveira84/react-dynamic-forms-ui/styles.css'

const { internalSchema } = await generateSchema({ from: 'text', prompt, model })

<DynamicForm schema={internalSchema} onSubmit={(data) => console.log(data)} />
```

## Options

```ts
generateSchema({
  from: 'text',
  prompt: '...',
  model,
  maxFields: 10,          // cap field count (default: 20)
  system: 'Custom system prompt',
})
```

## How it works

`generateSchema` uses the AI SDK's `generateObject` with a Zod meta-schema constraining the model to emit a valid `InternalSchema`. The SDK validates + retries automatically, so malformed output never escapes. Supported field kinds: text, email, password, url, number, slider, textarea, boolean, date, datetime, time, enum, multi-enum, object (one level), array, file — plus `showIf` conditional logic.

## Server-only

Never call `generateSchema` from the browser — your API key would leak. Put it behind a Next.js route handler, Hono endpoint, Vercel Edge Function, or whatever your backend is.

## License

MIT © Roger Oliveira
