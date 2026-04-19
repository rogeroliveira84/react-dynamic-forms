---
'@rogeroliveira84/react-dynamic-forms': minor
'@rogeroliveira84/react-dynamic-forms-ui': minor
'@rogeroliveira84/react-dynamic-forms-ai': minor
---

# v2 — AI launch 🤖

## New

- **`@rogeroliveira84/react-dynamic-forms-ai`** ships for real. `generateSchema({ from, prompt, model })` turns natural language, TypeScript, or a JSON sample into an `InternalSchema` + ready-to-paste Zod code + JSON Schema. Built on the Vercel AI SDK, provider-agnostic (Anthropic / OpenAI / Google / anything `LanguageModelV1`).
- **`file` field kind** — single/multiple file upload with `accept`, `maxSize`, preview, remove, Zod `instanceof(File)` validation.
- **`showIf` conditional fields** — any field can declare `showIf: { field, equals }` to render only when a dependency matches. Honored by JSON Schema adapter via `x-rdf-show-if` extension.
- **`internalToZod`** re-exported from core (consumed by the AI package's emitter; also useful for anyone who wants a Zod schema at runtime without relying on a Zod-native source).

## Changed

- `core` `BaseFieldSpec` gained optional `showIf`.
- `FieldKind` union gained `file`.
- `JsonSchema` type now accepts `contentMediaType`, `format: 'data-url'`, and custom extensions `x-rdf-show-if`, `x-rdf-max-size`, `x-rdf-multiple`.

## Docs

- Live AI playground at `apps/docs` (Next.js 15 + Tailwind + shadcn). Landing with hero, feature grid, three-way code examples, comparison table, and the playground. Deploys to Vercel; set `ANTHROPIC_API_KEY` in env.
