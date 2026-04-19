---
description: Add a new example form to the demo app
---

# /new-example

Add an example that showcases a specific use case.

Ask: what's the example's story (e.g., "multi-step signup", "dynamic invoice line items", "conditional fields in a questionnaire")?

## Steps

1. Create `apps/demo/src/examples/<slug>.ts` with a Zod or JSON Schema schema.
2. Add a new tab to `apps/demo/src/App.tsx`.
3. If any field kind or API surface is new, update core/ui first (use `/new-field`).
4. `pnpm --filter demo dev` — visually verify.
5. Screenshot for README if marketing-worthy.
6. Commit.
