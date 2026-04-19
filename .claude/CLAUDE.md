# CLAUDE.md — React Dynamic Forms

Project-level context for Claude Code sessions. Read this first.

## What this project is

**`@rogeroliveira84/react-dynamic-forms`** — a Zod-first dynamic React form library. Pass a schema (Zod, JSON Schema Draft 2020-12, or legacy v0.5 config), get a fully-validated form rendered with shadcn/ui.

The repo started as a CRA learning project in 2019. v1 is a from-scratch modernization toward a publishable npm library. v2 (future) adds AI-powered schema generation. Full design: `docs/superpowers/specs/2026-04-19-rdf-modernization-design.md`.

## Stack

- **Runtime:** React 19, TypeScript 5.6 (strict)
- **Monorepo:** pnpm workspaces + Turborepo
- **Validation:** Zod 3.23+ via `@hookform/resolvers/zod`
- **Forms:** react-hook-form 7
- **UI:** shadcn/ui (Radix + Tailwind 3)
- **Build:** `tsup` (libs), Vite (demo), Next.js 15 (docs — stub for v1)
- **Test:** Vitest + React Testing Library (Playwright in v2 for e2e)
- **Release:** Changesets + GitHub Actions

## Monorepo map

| Path | Contents |
|------|----------|
| `packages/core` | `@rogeroliveira84/react-dynamic-forms` — adapters, `InternalSchema`, `useDynamicForm` hook |
| `packages/ui`   | `@rogeroliveira84/react-dynamic-forms-ui` — shadcn field components + `<DynamicForm>` |
| `packages/ai`   | Placeholder for v2 AI generator |
| `apps/demo`     | Vite demo showing Zod / JSON Schema / legacy examples |

## How to run

```bash
pnpm install              # one-time
pnpm dev                  # dev servers in parallel via Turbo
pnpm --filter demo dev    # just the Vite demo
pnpm test                 # all tests
pnpm typecheck            # all packages
pnpm build                # build all packages
pnpm changeset            # create a changeset for release
```

## Coding conventions

- **Strict TS everywhere.** Avoid `any`; when unavoidable, comment why.
- **No default exports** — makes refactors and auto-imports cleaner.
- **Co-locate tests.** `foo.ts` tested by `foo.test.ts` in the same folder.
- **Pure logic in `core`, UI in `ui`.** Never import from `ui` in `core`.
- **Field kinds** are exhaustive in `InternalSchema`. Adding a new kind = update `FieldKind` union + `FieldResolver` switch + adapter mappings + test.
- **Prefer `z.describe()` over manual label metadata** for Zod users — the adapter reads it.
- **React: function components only, no classes.** Use `React.forwardRef` when props include `ref`.

## Common tasks

### Add a new field kind (e.g., `color`)
1. Add to `FieldKind` union in `packages/core/src/internal-schema.ts`.
2. Extend `FieldSpec` with the new spec.
3. Update `zodToInternalSchema`, `jsonSchemaToInternalSchema`, `legacyConfigToInternalSchema` with detection + tests.
4. Add mapping in `schema-to-zod.ts`.
5. Create `packages/ui/src/fields/color-field.tsx`.
6. Add case to `field-resolver.tsx`.
7. Update the demo example.
8. Changeset.

Use the `/new-field` command — it guides this flow.

### Add a new schema adapter (e.g., OpenAPI)
1. Create `packages/core/src/adapters/openapi.ts` + `.test.ts` (TDD).
2. Export from `index.ts`.
3. Extend `detectAndConvert` with a new detector.

Use `/schema-adapter`.

## Release process

1. Create a changeset: `pnpm changeset`
2. Commit the `.changeset/*.md` file.
3. When merged to `master`, the release workflow opens a "Version Packages" PR.
4. Merge that PR → auto-publishes to npm.

## Forbidden

- Enzyme (migrated to RTL)
- `react-scripts` / CRA (migrated to Vite + Next.js)
- `ReactDOM.render` (use `createRoot`)
- PropTypes (use TypeScript)
- Default React exports
- Bootstrap (migrated to shadcn)
- Hardcoded `required: "true"` as string (boolean only in InternalSchema)

## Spec & plan

- Design: `docs/superpowers/specs/2026-04-19-rdf-modernization-design.md`
- Plan:   `docs/superpowers/plans/2026-04-19-rdf-v1-foundation.md`
