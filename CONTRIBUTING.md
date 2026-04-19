# Contributing

Thanks for the interest — PRs welcome.

## Getting started

```bash
git clone https://github.com/rogeroliveira84/react-dynamic-forms
cd react-dynamic-forms
pnpm install
pnpm dev
```

Monorepo layout:

- `packages/core` — schema adapters + `useDynamicForm` hook
- `packages/ui` — shadcn field components + `<DynamicForm>`
- `packages/ai` — v2 placeholder
- `apps/demo` — Vite demo

## Before opening a PR

1. `pnpm typecheck` — zero errors.
2. `pnpm test` — all green (add tests for new behavior or bug fixes).
3. `pnpm build` — every package emits `dist/`.
4. `pnpm changeset` — pick affected packages + patch/minor/major + a user-facing description. Commit the `.changeset/*.md` file.

For larger changes (new field kinds, new schema adapter), open an issue first so we can align on API shape.

## Branch + commit style

- Branch: `feat/<slug>`, `fix/<slug>`, `docs/<slug>`, `chore/<slug>`.
- Conventional commits are nice but not enforced.
- Keep PRs focused — one logical change per PR.
