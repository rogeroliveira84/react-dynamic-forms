# @rogeroliveira84/react-dynamic-forms-ai

> 🤖 Placeholder for v2. AI-powered schema generation — stay tuned.

Will expose a `generateSchema({ prompt, from, model })` helper that turns natural language, TypeScript types, JSON samples, or OpenAPI specs into Zod schemas consumable by `@rogeroliveira84/react-dynamic-forms`.

Planned entry points (subject to change):

```ts
import { generateSchema } from '@rogeroliveira84/react-dynamic-forms-ai'

const schema = await generateSchema({
  prompt: 'A job application form for a software engineer role',
  model: 'claude-opus-4-7',
})
```

See the [v1 design spec](../../docs/superpowers/specs/2026-04-19-rdf-modernization-design.md) §13.
