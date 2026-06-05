# @rogeroliveira84/react-dynamic-forms-ui

## 1.1.0

### Minor Changes

- 274ec89: # Power features — wizard, async combobox, i18n

  ## New
  - **Multi-step wizard** — `<DynamicForm.Wizard steps={[...]}>` (also exported as `FormWizard`). One underlying form across steps; "Next" validates only the current step's fields via `form.trigger`, with a built-in progress indicator and a dev warning when steps don't cover all fields.
  - **Combobox** — new `combobox` field kind: a searchable single-select. Supply async options at render with `<DynamicForm asyncOptions={{ field: (query) => Promise<EnumOption[]> }}>` and any field (even a plain `z.string()`) becomes a debounced, keyboard-navigable async combobox. Detected from JSON Schema via the `x-rdf-combobox` extension.
  - **i18n** — localize all validation messages with a single `locale` prop (`'en' | 'pt-BR' | 'es'`, or a custom message object). Per-key overrides via `messages`. Messages set explicitly on the schema still win. Implemented as a Zod `errorMap`, so it works for Zod, JSON Schema, and legacy inputs alike.

  ## Changed
  - `core` `FieldKind` union gained `combobox`; `JsonSchema` accepts `x-rdf-combobox`.
  - `core` exports the i18n helpers (`createErrorMap`, `resolveMessages`, locale packs) and `RdfLocaleInput` / `RdfMessages` types.
  - `ui` `<DynamicForm>` gained `locale`, `messages`, and `asyncOptions` props (all optional, fully backward compatible).

  ## Notes
  - One new dependency in `ui`: `@radix-ui/react-popover` (powers the combobox). Wizard and i18n add no dependencies.

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

- Updated dependencies [274ec89]
- Updated dependencies [95d307a]
  - @rogeroliveira84/react-dynamic-forms@1.1.0

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
