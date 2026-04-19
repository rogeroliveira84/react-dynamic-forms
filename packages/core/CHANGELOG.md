# @rogeroliveira84/react-dynamic-forms

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
