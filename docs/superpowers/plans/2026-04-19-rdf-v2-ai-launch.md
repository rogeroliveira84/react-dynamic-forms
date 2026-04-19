# RDF v2 AI Launch — Implementation Plan

**Goal:** Ship the AI-generated schema feature + live playground + `file` field + conditional fields.

**Architecture:** `packages/ai` becomes real (Vercel AI SDK `generateObject` against an InternalSchema meta-schema); `apps/docs` is a Next.js 15 app with landing + playground; core gets `showIf` on `BaseFieldSpec` and a `file` FieldKind; UI gets `FileField` + `showIf` resolution in `FieldResolver`.

**Tech Stack:** Next.js 15 (App Router), Vercel AI SDK 4, `@ai-sdk/anthropic`, Zod `generateObject` meta-schema, Tailwind 3.

**Spec:** `docs/superpowers/specs/2026-04-19-rdf-v2-ai-launch-design.md`

---

## Phase 2.1 — Core: `file` kind + `showIf`

### Task 1: Extend InternalSchema with `file` kind + `showIf`
- Add `file` to `FieldKind` union in `packages/core/src/internal-schema.ts`.
- Add `FileFieldSpec` (accept, maxSize, multiple).
- Add `showIf?: { field: string; equals: string | number | boolean }` to `BaseFieldSpec`.
- Re-export types from `index.ts`.
- Add tests for InternalSchema shape (type-only; no runtime needed).

### Task 2: Zod adapter — file + showIf pass-through
- If zod field has `.describe('file')` or wraps `z.instanceof(File)`, emit `kind: 'file'`.
- showIf: skip (Zod doesn't express it cleanly); consumers using Zod won't get it until v2.1.
- Update `schema-to-zod.ts` to emit `z.instanceof(File)` from `file` kind.

### Task 3: JSON Schema adapter — file + showIf
- `{ type: 'string', format: 'data-url' }` or `contentMediaType` → `file` kind.
- Custom extension `x-rdf-show-if: { field, equals }` → `showIf`.
- Test both.

### Task 4: Legacy adapter — neither (intentionally)
- Legacy config doesn't express file or showIf; no changes.

### Task 5: Export `internalToZod` again
- Needed by the AI package to produce zodCode (emitter internally uses it for validation and round-trip).
- Re-export from `packages/core/src/index.ts`.

## Phase 2.2 — UI: FileField + conditional rendering

### Task 6: FileField component
- New `packages/ui/src/fields/file-field.tsx` using `Controller` + native `<input type="file">` + preview/remove UI.
- Respect `accept`, `maxSize` (client-side check with error in FieldWrapper), `multiple`.
- Test: renders, accepts a File blob, validates size.

### Task 7: FieldResolver handles file
- Add case to `field-resolver.tsx`.

### Task 8: `showIf` honored by FieldResolver
- Before rendering a field, `useWatch({ name: field.showIf.field })` and short-circuit to `null` if predicate fails.
- Test: form with two fields, one `showIf` the other — toggling shows/hides.

## Phase 2.3 — AI package

### Task 9: `packages/ai` real implementation
- Rewrite `packages/ai/src/index.ts` as actual `generateSchema` function.
- Build the Zod meta-schema that describes `InternalSchema` (field kinds enum, options shape, nested object/array support capped at one level of nesting for v2).
- Call `generateObject` from `ai` with the meta-schema + a carefully crafted system prompt.
- Convert returned `InternalSchema` → Zod code (new `emit-zod.ts`) + JSON Schema via existing adapters.
- Handle the three `from` modes (text prompt, TS source, JSON sample).
- Tests with mocked `generateObject` (don't hit real APIs in CI).

### Task 10: `packages/ai/src/emit-zod.ts`
- Given an `InternalSchema`, emit idiomatic Zod source code as a string.
- Covers all v2 field kinds including file and showIf as `.describe()` comments.
- Tests for each kind.

### Task 11: `packages/ai` package.json
- Bump to v0.1.0 (no longer private).
- Dependencies: `ai` (Vercel AI SDK), `@rogeroliveira84/react-dynamic-forms` (workspace:*).
- PeerDependenciesMeta: all three provider SDKs (`@ai-sdk/anthropic`, `@ai-sdk/openai`, `@ai-sdk/google`) as `peerDependenciesMeta` with `optional: true` — user brings whichever they want.
- Add changeset entry.

### Task 12: `packages/ai` README
- Install, quick start with Anthropic + OpenAI + Google examples.

## Phase 2.4 — Docs app (landing + playground)

### Task 13: Next.js 15 scaffold
- Replace existing stub `apps/docs` with full Next.js 15 App Router.
- Tailwind 3 sharing the same `--rdf-*` tokens as `packages/ui`.
- Geist font.
- Root layout + global styles.

### Task 14: Landing page (`app/page.tsx`)
- Hero section (H1, subhead, two CTAs).
- Code example tabs (Zod / JSON Schema / AI prompt) using shadcn Tabs.
- Feature grid (6 cards).
- Comparison table.
- Footer with links.

### Task 15: Playground page (`app/playground/page.tsx`)
- Client component with prompt textarea + from-mode selector + model picker.
- Fetches POST `/api/generate`.
- Renders the returned `<DynamicForm>` live using the generated InternalSchema.
- Shows Zod code in a code block with "Copy" button.
- Shows submit output as JSON.
- Example prompt buttons (5 presets).

### Task 16: API route (`app/api/generate/route.ts`)
- Reads `ANTHROPIC_API_KEY` from env.
- Rate-limits per IP (simple in-memory LRU for v2; upgrade to Vercel KV if launch goes hot).
- Calls `generateSchema` from `packages/ai`.
- Returns `{ internalSchema, zodCode, jsonSchema }`.

### Task 17: Vercel config
- `vercel.json` or just next.config sensible defaults.
- Document env var setup in README.
- Ensure `.env.local.example` with `ANTHROPIC_API_KEY=`.

## Phase 2.5 — Release

### Task 18: Changesets
- `packages/ai`: first real release (v0.1.0, `access: public`, remove `private: true`).
- `packages/core`, `packages/ui`: minor (file kind, showIf, re-export of internalToZod).
- Add a release note describing the playground URL.

### Task 19: CI — playground build in CI
- `apps/docs` already covered by `pnpm turbo build` because `docs` package was listed in workspaces.
- Verify GitHub Actions still green.

### Task 20: PR on GitHub
- Stacked on `feat/v1-foundation-rebirth` (base branch).
- When v1 merges, base rebases onto master automatically in most cases; otherwise manual rebase.

---

## Implementation order (execution)

1. Core changes (Tasks 1–5) — small, foundational
2. UI changes (Tasks 6–8) — depend on core
3. AI package (Tasks 9–12) — depend on core
4. Docs app (Tasks 13–17) — depend on AI + UI
5. Release prep (Tasks 18–20) — final

Each task commits separately; PR in Draft until all green.

## Self-Review

- ✅ Every v2 scope item from spec §2.1 has tasks.
- ✅ Risks (§10) addressed: rate-limit in Task 16, server-only env in Task 16, Zod meta-schema validation in Task 9.
- ✅ Out-of-scope items (§2.2) not in plan.
- ✅ Stacking on v1 branch is intentional (called out in Task 20).
