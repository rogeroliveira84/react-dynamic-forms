# React Dynamic Forms v2 — AI Launch Design

**Status:** Draft
**Date:** 2026-04-19
**Author:** Roger Oliveira
**Depends on:** v1 foundation (PR feat/v1-foundation-rebirth)

---

## 1. Vision

Ship the "wow" release that justifies the v1 → v2 jump and carries the marketing moment. Pitch:

> **"v0 for forms."** Describe your form in plain English → get a production-ready, validated React form in seconds. You own the generated code.

## 2. Scope

### 2.1 Must-ship (this spec)

1. **`@rogeroliveira84/react-dynamic-forms-ai`** — real implementation of `generateSchema({ prompt | typescript | jsonSample, model })` returning a Zod schema + JSON Schema. Built on **Vercel AI SDK 4+** with provider-agnostic model routing (Anthropic, OpenAI, Google).
2. **Live playground** (`apps/docs`) — Next.js 15 landing with a prompt box, live form preview, JSON submit output, "Copy Zod code" button. Deployed to Vercel.
3. **Conditional fields** — `dependsOn` metadata on `FieldSpec` (`showIf: { field, equals: value }`). Renderer respects it.
4. **File upload field** — new `file` kind with preview + progress.
5. **Landing page** (`apps/docs/`) — hero, feature grid, live playground iframe, comparison table, install/getting-started, link to docs.

### 2.2 Out of scope (future v2.x)

- Multi-step wizard — complex enough to deserve its own spec
- Rich text (tiptap)
- Combobox / async select
- Full docs site with per-field API reference (stub for now, content later)
- i18n plugin

## 3. `packages/ai` architecture

### 3.1 Public API

```ts
import { generateSchema } from '@rogeroliveira84/react-dynamic-forms-ai'
import { anthropic } from '@ai-sdk/anthropic'

const result = await generateSchema({
  from: 'text',
  prompt: 'A job application form for software engineers with experience, skills, and portfolio link',
  model: anthropic('claude-sonnet-4-6'),
})

result.internalSchema    // InternalSchema from @rogeroliveira84/react-dynamic-forms
result.zodCode           // string — ready-to-paste Zod source code
result.jsonSchema        // JSON Schema Draft 2020-12
```

Signature:
```ts
type GenerateInput =
  | { from: 'text'; prompt: string }
  | { from: 'typescript'; source: string }
  | { from: 'json-sample'; sample: unknown; hint?: string }

type GenerateOptions = GenerateInput & {
  model: LanguageModelV1  // Vercel AI SDK model instance
  maxFields?: number      // defaults to 20
  system?: string         // override the system prompt
}

type GenerateResult = {
  internalSchema: InternalSchema
  zodCode: string
  jsonSchema: JsonSchema
}

export function generateSchema(opts: GenerateOptions): Promise<GenerateResult>
```

### 3.2 Why Vercel AI SDK

- `generateObject()` with a Zod validation schema gives **typed, validated output** out of the box — the AI can't return malformed data; if the model's output doesn't match, the SDK retries.
- Provider-agnostic — same code runs against Claude, GPT, Gemini. Users plug their own.
- Handles streaming if needed (future enhancement).
- First-class type safety.

### 3.3 The trick: Zod meta-schema

`generateObject` needs a Zod schema describing what we want back. We hand it a Zod description of our `InternalSchema` → the AI returns a valid `InternalSchema` → we convert to Zod source code and JSON Schema.

### 3.4 Zod code emitter

Given an `InternalSchema`, emit idiomatic Zod source as a string. This is what the "Copy code" button gives the user.

```ts
// Input: InternalSchema with fields [{ kind: 'text', name: 'email', required: true }, ...]
// Output:
//   import { z } from 'zod'
//
//   export const schema = z.object({
//     email: z.string().email(),
//     ...
//   })
```

## 4. Conditional fields

Extend `BaseFieldSpec` with:
```ts
type ShowIf = { field: string; equals: string | number | boolean }
type BaseFieldSpec = { ... existing ..., showIf?: ShowIf }
```

The renderer in `FieldResolver` subscribes to the watched field via RHF's `useWatch` and hides the child when the predicate fails. Extend adapters:
- Zod: user attaches via `.describe('showIf:field=value')` metadata (ugly but works) OR more cleanly via a custom `.meta({ showIf: { ... } })` helper we export.
- JSON Schema: `x-rdf-show-if` extension key.
- Legacy: not supported (legacy is deprecated anyway).

Minimal v2: ship the runtime `showIf` in `InternalSchema` + JSON Schema adapter + a small `withShowIf(zodField, rule)` helper. Full Zod metadata integration can iterate.

## 5. File upload field

New `kind: 'file'`:
```ts
type FileFieldSpec = BaseFieldSpec & {
  kind: 'file'
  accept?: string       // MIME types, e.g. 'image/*,.pdf'
  maxSize?: number      // bytes
  multiple?: boolean
}
```

Adapters:
- Zod: `z.instanceof(File)` (or `z.custom<File>()` for broader compat) + `.refine(f => f.size <= max)`.
- JSON Schema: `{ type: 'string', format: 'data-url' }` or custom `{ type: 'string', contentMediaType: 'image/*' }`.

UI: `FileField` component with drag-drop + filename preview + remove button. Uses RHF's `Controller` since file inputs can't be fully registered.

## 6. Playground UX

```
┌──────────────────────────────────────────────────┐
│  React Dynamic Forms — AI Playground             │
├──────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────┐ │
│ │ Describe your form...                        │ │
│ │                                              │ │
│ │ [Generate ✨]  [Text│TS│JSON]   [Model ⌄]   │ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│ ┌────────────────────────┬─────────────────────┐ │
│ │  Live preview          │  Generated code     │ │
│ │  (actual form renders) │  (Zod source)       │ │
│ │  with submit button    │  [Copy]             │ │
│ └────────────────────────┴─────────────────────┘ │
│                                                  │
│  Submitted JSON output                           │
└──────────────────────────────────────────────────┘
```

Prompt examples (prefilled buttons): "User signup", "Invoice", "Job application", "Product config".

Backend: Next.js API route `POST /api/generate` → calls `generateSchema` with API key from env.

## 7. Landing page structure (`apps/docs/`)

Next.js 15 App Router. Single route `/` + `/playground`.

Sections on `/`:
1. Hero (headline, subhead, primary CTA "Try the playground", secondary "npm install")
2. 60-second video / animated GIF (placeholder for now)
3. Three code examples (Zod input, JSON Schema input, AI prompt) — tab switcher
4. Feature grid (6 tiles: type-safe, headless, hybrid input, AI-ready, accessible, tiny bundle)
5. Comparison table (vs RJSF, JSON Forms, react-hook-form)
6. Footer

Tech: shadcn/ui, Tailwind 3 (same tokens as `packages/ui` to stay visually consistent), Geist font.

## 8. Dependencies

### 8.1 packages/ai new runtime deps
- `ai` — Vercel AI SDK core
- `@rogeroliveira84/react-dynamic-forms` — workspace:* (the types + internalToZod reborn for emission)

Peer deps (one required):
- `@ai-sdk/anthropic`
- `@ai-sdk/openai`
- `@ai-sdk/google`

### 8.2 apps/docs new deps
- `next` 15
- `@ai-sdk/anthropic` (for the playground default)
- Same shadcn/UI package from workspace

## 9. Release plan

- `packages/ai` ships as **v0.1.0** — pre-1.0 because it's new surface area.
- `packages/core`, `packages/ui` bump to **v1.1.0** (minor) — added `file` kind, `showIf`, re-exposed `internalToZod` for the AI package's emitter.
- Marketing beat:
  - Blog post: "I built v0 for forms" (dev.to, Medium)
  - Twitter/X thread with 60s playground GIF
  - r/reactjs + r/sideproject + r/typescript posts
  - LinkedIn post

## 10. Risks & mitigations

| Risk | Mitigation |
|---|---|
| AI cost if playground goes viral | Rate-limit per IP in Next.js middleware; cache same-prompt results in Vercel KV |
| API key exposure | Server-only env, API routes, zero client-side model calls |
| Generated schemas hallucinate weird field types | Zod validation of the meta-schema guarantees output ∈ FieldKind union; retries built into `generateObject` |
| LandingPage copy feels AI-slop | Hand-write it; use the AI only for form generation |
| Stacking PR on unmerged v1 | Rebase once v1 lands; CI runs independently |

## 11. Success signals

- 500+ playground sessions in first month
- Zod source export used (measurable via "Copy code" click tracking)
- Positive thread reply on Twitter/X
- Featured in a newsletter (This Week in React or JavaScript Weekly)

## 12. Out of scope for this PR (but will come in v2.1/v2.2)

- `<DynamicForm.Wizard>` multi-step
- Rich text (tiptap) field
- Combobox with async search
- i18n plugin
- Theme customization UI in playground
- Form builder visual (drag-and-drop) — maybe v3
