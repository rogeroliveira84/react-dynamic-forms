# Changesets

Hello and welcome! This folder contains [Changesets](https://github.com/changesets/changesets) — individual units of change that eventually become release notes and version bumps.

## Adding a changeset

```bash
pnpm changeset
```

Pick the packages touched, choose `patch`/`minor`/`major`, write a user-facing description.

When the PR is merged to `master`, a bot opens a "Version Packages" PR. Merging that publishes to npm.
