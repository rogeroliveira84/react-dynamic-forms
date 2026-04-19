---
description: Scaffold a new field kind end-to-end
---

# /new-field

Add a new field kind to react-dynamic-forms.

Ask the user:
1. Field kind identifier (e.g., `color`, `file`, `combobox`) — kebab if multi-word.
2. What Zod/JSON Schema source maps to it (e.g., `z.string().regex(/#[0-9a-f]{6}/)` for color, `{ format: 'color' }` for JSON Schema).
3. What primitive UI component does it render? (Use existing or add to `packages/ui/src/primitives/`.)

## Steps

1. Update `packages/core/src/internal-schema.ts`:
   - Add to the `FieldKind` union.
   - Add/extend a `...FieldSpec` type with kind-specific props.
2. Update adapters with detection tests first (TDD):
   - `adapters/zod.test.ts` — Zod detection.
   - `adapters/json-schema.test.ts` — JSON Schema detection.
   - `adapters/legacy.test.ts` — if legacy has a mapping.
3. Make the tests pass.
4. Update `schema-to-zod.ts` for a Zod validator from the new spec.
5. Create `packages/ui/src/fields/<kind>-field.tsx`.
6. Add case to `packages/ui/src/fields/field-resolver.tsx`.
7. Add the field to `apps/demo/src/examples/zod-example.ts`.
8. `pnpm test` — all green.
9. `pnpm changeset` — minor bump.
10. Commit.
