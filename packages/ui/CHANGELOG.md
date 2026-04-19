# @rogeroliveira84/react-dynamic-forms-ui

## 2.0.0

### Minor Changes

- 95d307a: # v2 — AI launch 🤖

  ## New
  - **`file` field kind** — single/multiple file upload with `accept`, `maxSize`, preview, remove, Zod `instanceof(File)` validation.
  - **`showIf` conditional fields** — any field can declare `showIf: { field, equals }` to render only when a dependency matches. Honored by JSON Schema adapter via `x-rdf-show-if` extension.
  - **`internalToZod`** re-exported from core (consumed by the AI package's emitter; also useful for anyone who wants a Zod schema at runtime without relying on a Zod-native source).
  - Sister package **`@rogeroliveira84/react-dynamic-forms-ai`** (AI-powered schema generation built on the Vercel AI SDK) is available separately — see its own release.

  ## Changed
  - `core` `BaseFieldSpec` gained optional `showIf`.
  - `FieldKind` union gained `file`.
  - `JsonSchema` type now accepts `contentMediaType`, `format: 'data-url'`, and custom extensions `x-rdf-show-if`, `x-rdf-max-size`, `x-rdf-multiple`.

  ## Docs
  - Live AI playground at `apps/docs` (Next.js 15 + Tailwind + shadcn). Landing with hero, feature grid, three-way code examples, comparison table, and the playground. Deploys to Vercel; set `ANTHROPIC_API_KEY` in env.

### Patch Changes

- Updated dependencies [95d307a]
  - @rogeroliveira84/react-dynamic-forms@2.0.0

## 1.0.0

### Major Changes

- 0b5eeb9: # v1.0.0 — Foundation

  React Dynamic Forms is reborn as a modern Zod-first dynamic form library.
  - Monorepo architecture (pnpm + Turborepo)
  - React 19 + TypeScript strict
  - Hybrid schema input: Zod, JSON Schema Draft 2020-12, or legacy v0.5 config
  - shadcn/ui components, Tailwind-based, headless-friendly
  - react-hook-form under the hood with automatic Zod validation
  - Tree-shakable, sub-15 kb gzipped core
  - Full field support: text, email, password, url, number, slider, textarea, boolean, date, datetime, time, enum, multi-enum, object (nested), array (repeater)
  - Breaking change: `config` prop renamed to `schema` (legacy `config` kept with deprecation warning, removed in v2)

  See migration guide: `docs/migrate-from-v0.md`

### Patch Changes

- Updated dependencies [0b5eeb9]
  - @rogeroliveira84/react-dynamic-forms@1.0.0
