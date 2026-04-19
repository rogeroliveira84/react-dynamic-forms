---
description: Add a new schema format adapter (OpenAPI, Prisma, TypeBox, etc.)
---

# /schema-adapter

Plug a new input format into the adapter pipeline.

Ask: what's the format, and what's a representative input? Fetch 2–3 examples from the format's docs if needed.

## Steps

1. Create `packages/core/src/adapters/<name>.ts` and `.test.ts`.
2. TDD: write tests for each `FieldSpec` kind the adapter supports.
3. Implement conversion to `InternalSchema`.
4. Extend `detectAndConvert` with a `is<Name>(input)` guard.
5. Export from `packages/core/src/index.ts`.
6. Add a demo example under `apps/demo/src/examples/<name>.ts`.
7. `pnpm test`.
8. README: add to "Supported schema inputs" table.
9. Changeset (minor).
10. Commit.
