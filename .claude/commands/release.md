---
description: Create a changeset and prepare a release
---

# /release

Guide Roger through releasing a new version.

## Steps

1. Run `pnpm changeset` and ask the user what kind of change (patch/minor/major) and which packages.
2. Write the changeset markdown file with a clear, user-facing description.
3. Commit: `git add .changeset && git commit -m "chore: add changeset for <summary>"`
4. Push branch and open PR if not on `master`.
5. Once merged to `master`, the release workflow handles publishing.

## Context

- Packages follow linked versioning: `core` and `ui` bump together.
- `ai` and apps are ignored by changesets.
- Use prerelease mode (`pnpm changeset pre enter next`) for v1-beta style tags.
