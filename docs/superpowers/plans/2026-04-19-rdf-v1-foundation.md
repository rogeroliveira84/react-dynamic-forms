# React Dynamic Forms v1 Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform `react-dynamic-forms` from a CRA-based single-package project into a modern pnpm/Turborepo monorepo shipping a Zod-first headless dynamic form library with shadcn UI, publishable to npm as v1.0.0.

**Architecture:** pnpm workspaces + Turborepo. Three packages (`core` / `ui` / `ai` placeholder) + two apps (`demo` / `docs`). Core exposes a `<DynamicForm>` accepting Zod, JSON Schema, or legacy config; internally uses react-hook-form with adapter pipeline into a canonical `InternalSchema`.

**Tech Stack:** React 19, TypeScript 5.6 (strict), Zod 3.23+, react-hook-form 7, @hookform/resolvers, shadcn/ui, Tailwind 3 (with Tailwind 4 migration noted for later), Vite 5 (demo), Next.js 15 (docs), Vitest, React Testing Library, Playwright, tsup, Changesets, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-04-19-rdf-modernization-design.md`

---

## File Structure Plan

```
react-dynamic-forms/
├── apps/
│   ├── demo/              Vite + React 19 demo (Zod / JSON Schema / legacy examples)
│   └── docs/              Next.js 15 landing + getting-started + live playground
├── packages/
│   ├── core/              Schema adapters + InternalSchema + useDynamicForm hook + DynamicForm orchestrator
│   ├── ui/                shadcn field components (TextField, EnumField, ArrayField, etc.) + <DynamicForm> default
│   └── ai/                Placeholder for v2 AI generator
├── .claude/
│   ├── CLAUDE.md
│   ├── settings.json
│   ├── commands/          release.md, new-field.md, new-example.md, schema-adapter.md
│   └── agents/            form-field-builder.md, docs-writer.md
├── .changeset/            Changesets config
├── .github/workflows/     ci.yml, release.yml
├── docs/
│   ├── migrate-from-v0.md
│   └── superpowers/       specs/ + plans/ (existing)
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── .nvmrc (22)
├── .npmrc
├── .gitignore
├── README.md              Marketing-first (English)
├── README.pt-br.md        Portuguese mirror
├── CONTRIBUTING.md
├── LICENSE                (keep)
└── package.json           Root workspace
```

**Legacy files to DELETE:**
`.circleci/`, `.travis.yml`, `_config.yml`, `Dockerfile`, `.dockerignore`, `src/` (moved into packages), `public/`, `.eslintrc` (replaced), root-level test config. Keep `LICENSE`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `.github/` (rewritten).

---

## Task 1: Create feature branch

**Files:** none (git operation)

- [ ] **Step 1: Create and switch to branch**

```bash
git checkout -b feat/v1-foundation-rebirth
```

- [ ] **Step 2: Verify**

```bash
git branch --show-current
```
Expected: `feat/v1-foundation-rebirth`

---

## Task 2: Remove legacy infra

**Files:**
- Delete: `.circleci/config.yml`, `.circleci/`
- Delete: `.travis.yml`, `_config.yml`, `Dockerfile`, `.dockerignore`
- Delete: `src/serviceWorker.js`
- Delete: `package-lock.json` (switching to pnpm)
- Delete: `node_modules/`

- [ ] **Step 1: Remove files**

```bash
rm -rf .circleci .travis.yml _config.yml Dockerfile .dockerignore node_modules package-lock.json
rm -f src/serviceWorker.js
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "chore: remove legacy infra (CRA, CircleCI, Travis, Dockerfile, serviceWorker)"
```

---

## Task 3: Root workspace setup

**Files:**
- Create: `pnpm-workspace.yaml`
- Create: `package.json` (root)
- Create: `turbo.json`
- Create: `.nvmrc`
- Create: `.npmrc`
- Create: `tsconfig.base.json`
- Modify: `.gitignore`

- [ ] **Step 1: `pnpm-workspace.yaml`**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 2: Root `package.json`**

```json
{
  "name": "react-dynamic-forms-monorepo",
  "version": "0.0.0",
  "private": true,
  "packageManager": "pnpm@9.12.0",
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "format": "prettier --write \"**/*.{ts,tsx,js,json,md}\"",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "turbo run build --filter=./packages/* && changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.9",
    "prettier": "^3.3.3",
    "turbo": "^2.3.0",
    "typescript": "^5.6.3"
  }
}
```

- [ ] **Step 3: `turbo.json`**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": { "cache": false, "persistent": true },
    "test": { "dependsOn": ["^build"], "outputs": ["coverage/**"] },
    "lint": {},
    "typecheck": { "dependsOn": ["^build"] }
  }
}
```

- [ ] **Step 4: `.nvmrc`**

```
22
```

- [ ] **Step 5: `.npmrc`**

```
auto-install-peers=true
strict-peer-dependencies=false
```

- [ ] **Step 6: `tsconfig.base.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true
  },
  "exclude": ["node_modules", "dist", ".next", "coverage"]
}
```

- [ ] **Step 7: Update `.gitignore`**

```
node_modules/
.DS_Store
dist/
.next/
coverage/
*.log
.turbo/
.vercel/
.env.local
.env.*.local
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: set up pnpm + turborepo monorepo root"
```

---

## Task 4: `packages/core` scaffold

**Files:**
- Create: `packages/core/package.json`
- Create: `packages/core/tsconfig.json`
- Create: `packages/core/tsup.config.ts`
- Create: `packages/core/vitest.config.ts`
- Create: `packages/core/src/index.ts`
- Create: `packages/core/README.md`

- [ ] **Step 1: `packages/core/package.json`**

```json
{
  "name": "@rogeroliveira84/react-dynamic-forms",
  "version": "1.0.0-next.0",
  "description": "Zod-powered dynamic React forms. Type-safe. AI-ready.",
  "license": "MIT",
  "author": "Roger Oliveira <rogeroliveira84@gmail.com>",
  "repository": { "type": "git", "url": "https://github.com/rogeroliveira84/react-dynamic-forms" },
  "homepage": "https://github.com/rogeroliveira84/react-dynamic-forms",
  "keywords": ["react", "react-19", "forms", "zod", "json-schema", "dynamic-forms", "react-hook-form", "shadcn", "typescript"],
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist", "README.md", "LICENSE"],
  "sideEffects": false,
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0",
    "zod": "^3.23.0"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.1",
    "react-hook-form": "^7.53.2"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitest/coverage-v8": "^2.1.5",
    "jsdom": "^25.0.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tsup": "^8.3.5",
    "typescript": "^5.6.3",
    "vitest": "^2.1.5",
    "zod": "^3.23.8"
  },
  "publishConfig": { "access": "public" }
}
```

- [ ] **Step 2: `packages/core/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "dist", "rootDir": "src" },
  "include": ["src"]
}
```

- [ ] **Step 3: `packages/core/tsup.config.ts`**

```ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', 'zod', 'react-hook-form'],
})
```

- [ ] **Step 4: `packages/core/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/test-setup.ts', 'src/index.ts'],
      thresholds: { branches: 85, functions: 85, lines: 85, statements: 85 },
    },
  },
})
```

- [ ] **Step 5: `packages/core/src/test-setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 6: `packages/core/src/index.ts` (stub)**

```ts
export const VERSION = '1.0.0-next.0'
```

- [ ] **Step 7: Install deps and verify build works**

```bash
pnpm install
pnpm --filter @rogeroliveira84/react-dynamic-forms build
```
Expected: `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts` created.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(core): scaffold core package with tsup + vitest"
```

---

## Task 5: Core — `InternalSchema` types

**Files:**
- Create: `packages/core/src/internal-schema.ts`

- [ ] **Step 1: Write the types**

```ts
// packages/core/src/internal-schema.ts

export type FieldKind =
  | 'text' | 'email' | 'password' | 'url'
  | 'number' | 'slider'
  | 'textarea'
  | 'boolean'
  | 'date' | 'datetime' | 'time'
  | 'enum' | 'multi-enum'
  | 'object' | 'array'

export type EnumOption = { value: string | number; label: string }

export type BaseFieldSpec = {
  name: string
  label?: string
  description?: string
  placeholder?: string
  required?: boolean
  defaultValue?: unknown
  disabled?: boolean
  hidden?: boolean
}

export type TextLikeFieldSpec = BaseFieldSpec & {
  kind: 'text' | 'email' | 'password' | 'url' | 'textarea'
  minLength?: number
  maxLength?: number
  pattern?: string
}

export type NumberFieldSpec = BaseFieldSpec & {
  kind: 'number' | 'slider'
  min?: number
  max?: number
  step?: number
}

export type BooleanFieldSpec = BaseFieldSpec & { kind: 'boolean' }

export type DateFieldSpec = BaseFieldSpec & {
  kind: 'date' | 'datetime' | 'time'
  min?: string
  max?: string
}

export type EnumFieldSpec = BaseFieldSpec & {
  kind: 'enum' | 'multi-enum'
  options: EnumOption[]
}

export type ObjectFieldSpec = BaseFieldSpec & {
  kind: 'object'
  fields: FieldSpec[]
}

export type ArrayFieldSpec = BaseFieldSpec & {
  kind: 'array'
  item: FieldSpec
  minItems?: number
  maxItems?: number
}

export type FieldSpec =
  | TextLikeFieldSpec
  | NumberFieldSpec
  | BooleanFieldSpec
  | DateFieldSpec
  | EnumFieldSpec
  | ObjectFieldSpec
  | ArrayFieldSpec

export type InternalSchema = {
  title?: string
  description?: string
  fields: FieldSpec[]
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/core/src/internal-schema.ts
git commit -m "feat(core): add InternalSchema canonical types"
```

---

## Task 6: Core — Zod adapter (TDD)

**Files:**
- Create: `packages/core/src/adapters/zod.ts`
- Create: `packages/core/src/adapters/zod.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// packages/core/src/adapters/zod.test.ts
import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { zodToInternalSchema } from './zod'

describe('zodToInternalSchema', () => {
  it('converts string field to text kind', () => {
    const schema = z.object({ name: z.string() })
    const result = zodToInternalSchema(schema)
    expect(result.fields).toHaveLength(1)
    expect(result.fields[0]).toMatchObject({ kind: 'text', name: 'name', required: true })
  })

  it('detects email from .email()', () => {
    const schema = z.object({ mail: z.string().email() })
    const result = zodToInternalSchema(schema)
    expect(result.fields[0]).toMatchObject({ kind: 'email' })
  })

  it('detects url from .url()', () => {
    const schema = z.object({ site: z.string().url() })
    expect(zodToInternalSchema(schema).fields[0]).toMatchObject({ kind: 'url' })
  })

  it('converts number with min/max', () => {
    const schema = z.object({ age: z.number().min(18).max(120) })
    const result = zodToInternalSchema(schema)
    expect(result.fields[0]).toMatchObject({ kind: 'number', min: 18, max: 120 })
  })

  it('converts boolean to boolean kind', () => {
    const schema = z.object({ news: z.boolean() })
    expect(zodToInternalSchema(schema).fields[0]).toMatchObject({ kind: 'boolean' })
  })

  it('converts z.date() to date kind', () => {
    const schema = z.object({ dob: z.date() })
    expect(zodToInternalSchema(schema).fields[0]).toMatchObject({ kind: 'date' })
  })

  it('converts z.enum() to enum kind with options', () => {
    const schema = z.object({ country: z.enum(['BR', 'US']) })
    const result = zodToInternalSchema(schema)
    expect(result.fields[0]).toMatchObject({
      kind: 'enum',
      options: [
        { value: 'BR', label: 'BR' },
        { value: 'US', label: 'US' },
      ],
    })
  })

  it('marks optional fields as not required', () => {
    const schema = z.object({ nick: z.string().optional() })
    expect(zodToInternalSchema(schema).fields[0]).toMatchObject({ required: false })
  })

  it('uses .describe() as description', () => {
    const schema = z.object({ name: z.string().describe('Full name') })
    expect(zodToInternalSchema(schema).fields[0]).toMatchObject({ description: 'Full name' })
  })

  it('converts nested z.object to object kind', () => {
    const schema = z.object({ addr: z.object({ city: z.string() }) })
    const result = zodToInternalSchema(schema)
    expect(result.fields[0]).toMatchObject({ kind: 'object', name: 'addr' })
    expect((result.fields[0] as any).fields[0]).toMatchObject({ kind: 'text', name: 'city' })
  })

  it('converts z.array(z.string()) to array kind', () => {
    const schema = z.object({ tags: z.array(z.string()) })
    const result = zodToInternalSchema(schema)
    expect(result.fields[0]).toMatchObject({ kind: 'array' })
    expect((result.fields[0] as any).item).toMatchObject({ kind: 'text' })
  })

  it('converts z.array(z.enum()) to multi-enum kind', () => {
    const schema = z.object({ langs: z.array(z.enum(['pt', 'en'])) })
    const result = zodToInternalSchema(schema)
    expect(result.fields[0]).toMatchObject({ kind: 'multi-enum' })
  })

  it('throws on non-object root schema', () => {
    expect(() => zodToInternalSchema(z.string() as any)).toThrow(/root must be z\.object/i)
  })
})
```

- [ ] **Step 2: Run tests — expect failure**

```bash
pnpm --filter @rogeroliveira84/react-dynamic-forms test
```
Expected: all tests FAIL with "zodToInternalSchema is not a function" or similar.

- [ ] **Step 3: Implement adapter**

```ts
// packages/core/src/adapters/zod.ts
import { z, type ZodTypeAny, type ZodObject, type ZodRawShape } from 'zod'
import type { FieldSpec, InternalSchema, EnumOption } from '../internal-schema'

function unwrap(schema: ZodTypeAny): { schema: ZodTypeAny; required: boolean; description?: string } {
  let current = schema
  let required = true
  let description = schema.description

  while (true) {
    if (current instanceof z.ZodOptional || current instanceof z.ZodNullable) {
      required = false
      current = current._def.innerType
      description ??= current.description
      continue
    }
    if (current instanceof z.ZodDefault) {
      current = current._def.innerType
      description ??= current.description
      continue
    }
    if (current instanceof z.ZodEffects) {
      current = current._def.schema
      description ??= current.description
      continue
    }
    break
  }

  return { schema: current, required, description }
}

function stringChecks(schema: z.ZodString): { kind: 'text' | 'email' | 'url'; minLength?: number; maxLength?: number } {
  const checks = schema._def.checks ?? []
  let kind: 'text' | 'email' | 'url' = 'text'
  let minLength: number | undefined
  let maxLength: number | undefined
  for (const c of checks) {
    if (c.kind === 'email') kind = 'email'
    else if (c.kind === 'url') kind = 'url'
    else if (c.kind === 'min') minLength = c.value
    else if (c.kind === 'max') maxLength = c.value
  }
  return { kind, minLength, maxLength }
}

function numberChecks(schema: z.ZodNumber): { min?: number; max?: number; step?: number } {
  const checks = schema._def.checks ?? []
  let min: number | undefined
  let max: number | undefined
  let step: number | undefined
  for (const c of checks) {
    if (c.kind === 'min') min = c.value
    else if (c.kind === 'max') max = c.value
    else if (c.kind === 'multipleOf') step = c.value
  }
  return { min, max, step }
}

function fieldFromZod(name: string, zodField: ZodTypeAny): FieldSpec {
  const { schema, required, description } = unwrap(zodField)
  const base = { name, required, ...(description ? { description } : {}) }

  if (schema instanceof z.ZodString) {
    const { kind, minLength, maxLength } = stringChecks(schema)
    return { ...base, kind, ...(minLength !== undefined ? { minLength } : {}), ...(maxLength !== undefined ? { maxLength } : {}) }
  }
  if (schema instanceof z.ZodNumber) {
    return { ...base, kind: 'number', ...numberChecks(schema) }
  }
  if (schema instanceof z.ZodBoolean) {
    return { ...base, kind: 'boolean' }
  }
  if (schema instanceof z.ZodDate) {
    return { ...base, kind: 'date' }
  }
  if (schema instanceof z.ZodEnum) {
    const values = schema._def.values as string[]
    const options: EnumOption[] = values.map((v) => ({ value: v, label: v }))
    return { ...base, kind: 'enum', options }
  }
  if (schema instanceof z.ZodNativeEnum) {
    const values = Object.values(schema._def.values) as (string | number)[]
    const options: EnumOption[] = values.map((v) => ({ value: v, label: String(v) }))
    return { ...base, kind: 'enum', options }
  }
  if (schema instanceof z.ZodArray) {
    const inner = unwrap(schema._def.type).schema
    if (inner instanceof z.ZodEnum) {
      const values = inner._def.values as string[]
      return {
        ...base,
        kind: 'multi-enum',
        options: values.map((v) => ({ value: v, label: v })),
      }
    }
    return { ...base, kind: 'array', item: fieldFromZod(`${name}Item`, schema._def.type) }
  }
  if (schema instanceof z.ZodObject) {
    return {
      ...base,
      kind: 'object',
      fields: Object.entries(schema._def.shape()).map(([k, v]) => fieldFromZod(k, v as ZodTypeAny)),
    }
  }

  // Fallback: treat unknown as text
  return { ...base, kind: 'text' }
}

export function zodToInternalSchema(schema: ZodTypeAny): InternalSchema {
  const root = unwrap(schema).schema
  if (!(root instanceof z.ZodObject)) {
    throw new Error('Zod root must be z.object(...) for DynamicForm')
  }
  const shape = (root as ZodObject<ZodRawShape>)._def.shape()
  return {
    fields: Object.entries(shape).map(([name, field]) => fieldFromZod(name, field as ZodTypeAny)),
  }
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
pnpm --filter @rogeroliveira84/react-dynamic-forms test
```
Expected: all 12 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/adapters/
git commit -m "feat(core): add Zod → InternalSchema adapter with 12 test cases"
```

---

## Task 7: Core — JSON Schema adapter (TDD)

**Files:**
- Create: `packages/core/src/adapters/json-schema.ts`
- Create: `packages/core/src/adapters/json-schema.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// packages/core/src/adapters/json-schema.test.ts
import { describe, it, expect } from 'vitest'
import { jsonSchemaToInternalSchema } from './json-schema'

describe('jsonSchemaToInternalSchema', () => {
  it('converts string property to text', () => {
    const result = jsonSchemaToInternalSchema({
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name'],
    })
    expect(result.fields[0]).toMatchObject({ kind: 'text', name: 'name', required: true })
  })

  it('detects email format', () => {
    const result = jsonSchemaToInternalSchema({
      type: 'object',
      properties: { mail: { type: 'string', format: 'email' } },
    })
    expect(result.fields[0]).toMatchObject({ kind: 'email' })
  })

  it('detects date format', () => {
    const result = jsonSchemaToInternalSchema({
      type: 'object',
      properties: { dob: { type: 'string', format: 'date' } },
    })
    expect(result.fields[0]).toMatchObject({ kind: 'date' })
  })

  it('converts number with min/max', () => {
    const result = jsonSchemaToInternalSchema({
      type: 'object',
      properties: { age: { type: 'number', minimum: 18, maximum: 120 } },
    })
    expect(result.fields[0]).toMatchObject({ kind: 'number', min: 18, max: 120 })
  })

  it('converts enum to enum kind', () => {
    const result = jsonSchemaToInternalSchema({
      type: 'object',
      properties: { country: { type: 'string', enum: ['BR', 'US'] } },
    })
    expect(result.fields[0]).toMatchObject({
      kind: 'enum',
      options: [{ value: 'BR', label: 'BR' }, { value: 'US', label: 'US' }],
    })
  })

  it('uses description', () => {
    const result = jsonSchemaToInternalSchema({
      type: 'object',
      properties: { name: { type: 'string', description: 'Full name' } },
    })
    expect(result.fields[0]).toMatchObject({ description: 'Full name' })
  })

  it('marks fields not in required array as optional', () => {
    const result = jsonSchemaToInternalSchema({
      type: 'object',
      properties: { nick: { type: 'string' } },
      required: [],
    })
    expect(result.fields[0]).toMatchObject({ required: false })
  })

  it('converts nested object', () => {
    const result = jsonSchemaToInternalSchema({
      type: 'object',
      properties: {
        addr: {
          type: 'object',
          properties: { city: { type: 'string' } },
          required: ['city'],
        },
      },
    })
    expect(result.fields[0]).toMatchObject({ kind: 'object' })
    expect((result.fields[0] as any).fields[0]).toMatchObject({ kind: 'text', name: 'city' })
  })

  it('converts array with items', () => {
    const result = jsonSchemaToInternalSchema({
      type: 'object',
      properties: { tags: { type: 'array', items: { type: 'string' } } },
    })
    expect(result.fields[0]).toMatchObject({ kind: 'array' })
  })

  it('throws on non-object root', () => {
    expect(() => jsonSchemaToInternalSchema({ type: 'string' } as any)).toThrow(/root must be an object/i)
  })
})
```

- [ ] **Step 2: Run tests — expect failure**

```bash
pnpm --filter @rogeroliveira84/react-dynamic-forms test
```
Expected: FAIL.

- [ ] **Step 3: Implement adapter**

```ts
// packages/core/src/adapters/json-schema.ts
import type { FieldSpec, InternalSchema, EnumOption } from '../internal-schema'

export type JsonSchema = {
  type?: string | string[]
  properties?: Record<string, JsonSchema>
  required?: string[]
  items?: JsonSchema
  enum?: (string | number)[]
  format?: string
  minimum?: number
  maximum?: number
  minLength?: number
  maxLength?: number
  multipleOf?: number
  pattern?: string
  description?: string
  title?: string
  default?: unknown
}

function jsonFieldFromSchema(name: string, schema: JsonSchema, required: boolean): FieldSpec {
  const base = {
    name,
    required,
    ...(schema.description ? { description: schema.description } : {}),
    ...(schema.title ? { label: schema.title } : {}),
    ...(schema.default !== undefined ? { defaultValue: schema.default } : {}),
  }

  if (schema.enum) {
    const options: EnumOption[] = schema.enum.map((v) => ({ value: v, label: String(v) }))
    return { ...base, kind: 'enum', options }
  }

  const type = Array.isArray(schema.type) ? schema.type[0] : schema.type

  if (type === 'string') {
    const fmt = schema.format
    if (fmt === 'email') return { ...base, kind: 'email' }
    if (fmt === 'uri' || fmt === 'url') return { ...base, kind: 'url' }
    if (fmt === 'date') return { ...base, kind: 'date' }
    if (fmt === 'date-time') return { ...base, kind: 'datetime' }
    if (fmt === 'time') return { ...base, kind: 'time' }
    if (fmt === 'password') return { ...base, kind: 'password' }
    return {
      ...base,
      kind: 'text',
      ...(schema.minLength !== undefined ? { minLength: schema.minLength } : {}),
      ...(schema.maxLength !== undefined ? { maxLength: schema.maxLength } : {}),
      ...(schema.pattern ? { pattern: schema.pattern } : {}),
    }
  }
  if (type === 'number' || type === 'integer') {
    return {
      ...base,
      kind: 'number',
      ...(schema.minimum !== undefined ? { min: schema.minimum } : {}),
      ...(schema.maximum !== undefined ? { max: schema.maximum } : {}),
      ...(schema.multipleOf !== undefined ? { step: schema.multipleOf } : {}),
    }
  }
  if (type === 'boolean') {
    return { ...base, kind: 'boolean' }
  }
  if (type === 'array') {
    const items = schema.items ?? { type: 'string' }
    if (items.enum) {
      return {
        ...base,
        kind: 'multi-enum',
        options: items.enum.map((v) => ({ value: v, label: String(v) })),
      }
    }
    return { ...base, kind: 'array', item: jsonFieldFromSchema(`${name}Item`, items, true) }
  }
  if (type === 'object') {
    const props = schema.properties ?? {}
    const req = new Set(schema.required ?? [])
    return {
      ...base,
      kind: 'object',
      fields: Object.entries(props).map(([k, v]) => jsonFieldFromSchema(k, v, req.has(k))),
    }
  }

  return { ...base, kind: 'text' }
}

export function jsonSchemaToInternalSchema(schema: JsonSchema): InternalSchema {
  const type = Array.isArray(schema.type) ? schema.type[0] : schema.type
  if (type !== 'object' && !schema.properties) {
    throw new Error('JSON Schema root must be an object with properties')
  }
  const props = schema.properties ?? {}
  const req = new Set(schema.required ?? [])
  return {
    ...(schema.title ? { title: schema.title } : {}),
    ...(schema.description ? { description: schema.description } : {}),
    fields: Object.entries(props).map(([k, v]) => jsonFieldFromSchema(k, v, req.has(k))),
  }
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
pnpm --filter @rogeroliveira84/react-dynamic-forms test
```
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/adapters/json-schema*
git commit -m "feat(core): add JSON Schema → InternalSchema adapter with 10 test cases"
```

---

## Task 8: Core — legacy config adapter (TDD)

**Files:**
- Create: `packages/core/src/adapters/legacy.ts`
- Create: `packages/core/src/adapters/legacy.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// packages/core/src/adapters/legacy.test.ts
import { describe, it, expect } from 'vitest'
import { legacyConfigToInternalSchema, type LegacyConfig } from './legacy'

describe('legacyConfigToInternalSchema', () => {
  it('converts v0.5 text field', () => {
    const cfg: LegacyConfig = {
      name: 'Form',
      fields: [{ id: 'name', label: 'Full Name', type: 'text', required: 'true', value: '' }],
    }
    const res = legacyConfigToInternalSchema(cfg)
    expect(res.fields[0]).toMatchObject({ kind: 'text', name: 'name', label: 'Full Name', required: true })
  })

  it('converts string "true"/"false" required to boolean', () => {
    const cfg: LegacyConfig = {
      name: 'Form',
      fields: [{ id: 'a', label: 'A', type: 'text', required: 'false', value: '' }],
    }
    expect(legacyConfigToInternalSchema(cfg).fields[0]).toMatchObject({ required: false })
  })

  it('maps v0.5 array type to enum', () => {
    const cfg: LegacyConfig = {
      name: 'Form',
      fields: [{
        id: 'country',
        label: 'Country',
        type: 'array',
        required: 'false',
        value: '',
        definition: { options: [{ id: 'br', display: 'Brazil' }, { id: 'us', display: 'US' }] },
      }],
    }
    expect(legacyConfigToInternalSchema(cfg).fields[0]).toMatchObject({
      kind: 'enum',
      options: [{ value: 'br', label: 'Brazil' }, { value: 'us', label: 'US' }],
    })
  })

  it('maps v0.5 multi-array to multi-enum', () => {
    const cfg: LegacyConfig = {
      name: 'Form',
      fields: [{
        id: 'cities',
        label: 'Cities',
        type: 'multi-array',
        required: 'false',
        value: [],
        definition: { options: [{ id: 'poa', display: 'Porto Alegre' }] },
      }],
    }
    expect(legacyConfigToInternalSchema(cfg).fields[0]).toMatchObject({ kind: 'multi-enum' })
  })

  it('maps datetime-local to datetime', () => {
    const cfg: LegacyConfig = {
      name: 'Form',
      fields: [{ id: 'dt', label: 'DT', type: 'datetime-local', required: 'false', value: '' }],
    }
    expect(legacyConfigToInternalSchema(cfg).fields[0]).toMatchObject({ kind: 'datetime' })
  })

  it('maps number with definition.min/max/step', () => {
    const cfg: LegacyConfig = {
      name: 'Form',
      fields: [{
        id: 'n', label: 'N', type: 'number', required: 'false', value: '',
        definition: { min: '0', max: '100', step: '1' },
      }],
    }
    expect(legacyConfigToInternalSchema(cfg).fields[0]).toMatchObject({ kind: 'number', min: 0, max: 100, step: 1 })
  })
})
```

- [ ] **Step 2: Run tests — expect fail**

```bash
pnpm --filter @rogeroliveira84/react-dynamic-forms test
```

- [ ] **Step 3: Implement adapter**

```ts
// packages/core/src/adapters/legacy.ts
import type { FieldSpec, InternalSchema, EnumOption } from '../internal-schema'

export type LegacyOption = { id: string | number; display: string }
export type LegacyDefinition = {
  options?: LegacyOption[]
  min?: string | number
  max?: string | number
  step?: string | number
  maxlength?: string | number
}
export type LegacyField = {
  id: string
  label: string
  description?: string
  type: 'text' | 'date' | 'datetime-local' | 'time' | 'number' | 'checkbox' | 'array' | 'multi-array'
  value: unknown
  required: 'true' | 'false' | boolean
  placeholder?: string
  defaultValue?: unknown
  definition?: LegacyDefinition
}
export type LegacyConfig = { name: string; fields: LegacyField[] }

const n = (v: string | number | undefined): number | undefined =>
  v === undefined ? undefined : typeof v === 'number' ? v : Number(v)

function legacyFieldToFieldSpec(f: LegacyField): FieldSpec {
  const required = f.required === true || f.required === 'true'
  const base = {
    name: f.id,
    label: f.label,
    required,
    ...(f.description ? { description: f.description } : {}),
    ...(f.placeholder ? { placeholder: f.placeholder } : {}),
    ...(f.defaultValue !== undefined && f.defaultValue !== '' ? { defaultValue: f.defaultValue } : {}),
  }
  const def = f.definition ?? {}

  switch (f.type) {
    case 'text':
      return { ...base, kind: 'text', ...(def.maxlength !== undefined ? { maxLength: Number(def.maxlength) } : {}) }
    case 'number':
      return {
        ...base,
        kind: 'number',
        ...(def.min !== undefined ? { min: n(def.min)! } : {}),
        ...(def.max !== undefined ? { max: n(def.max)! } : {}),
        ...(def.step !== undefined ? { step: n(def.step)! } : {}),
      }
    case 'date': return { ...base, kind: 'date' }
    case 'datetime-local': return { ...base, kind: 'datetime' }
    case 'time': return { ...base, kind: 'time' }
    case 'checkbox': return { ...base, kind: 'boolean' }
    case 'array': {
      const opts: EnumOption[] = (def.options ?? []).map((o) => ({ value: o.id, label: o.display }))
      return { ...base, kind: 'enum', options: opts }
    }
    case 'multi-array': {
      const opts: EnumOption[] = (def.options ?? []).map((o) => ({ value: o.id, label: o.display }))
      return { ...base, kind: 'multi-enum', options: opts }
    }
    default: return { ...base, kind: 'text' }
  }
}

export function legacyConfigToInternalSchema(cfg: LegacyConfig): InternalSchema {
  return {
    ...(cfg.name ? { title: cfg.name } : {}),
    fields: cfg.fields.map(legacyFieldToFieldSpec),
  }
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
pnpm --filter @rogeroliveira84/react-dynamic-forms test
```

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/adapters/legacy*
git commit -m "feat(core): add legacy v0.5 config → InternalSchema adapter"
```

---

## Task 9: Core — schema detector

**Files:**
- Create: `packages/core/src/adapters/detect.ts`
- Create: `packages/core/src/adapters/detect.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// packages/core/src/adapters/detect.test.ts
import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { detectAndConvert } from './detect'

describe('detectAndConvert', () => {
  it('detects Zod schema by _def', () => {
    const zs = z.object({ name: z.string() })
    expect(detectAndConvert(zs).fields[0]).toMatchObject({ name: 'name' })
  })

  it('detects JSON Schema by type + properties', () => {
    const js = { type: 'object', properties: { a: { type: 'string' } } } as const
    expect(detectAndConvert(js).fields[0]).toMatchObject({ name: 'a' })
  })

  it('detects legacy config by fields array', () => {
    const legacy = {
      name: 'F',
      fields: [{ id: 'x', label: 'X', type: 'text', value: '', required: 'false' }],
    }
    expect(detectAndConvert(legacy).fields[0]).toMatchObject({ name: 'x' })
  })

  it('throws on unrecognized input', () => {
    expect(() => detectAndConvert({ foo: 'bar' } as any)).toThrow(/unrecognized schema/i)
  })
})
```

- [ ] **Step 2: Run — expect fail**

- [ ] **Step 3: Implement**

```ts
// packages/core/src/adapters/detect.ts
import type { ZodTypeAny } from 'zod'
import type { InternalSchema } from '../internal-schema'
import { zodToInternalSchema } from './zod'
import { jsonSchemaToInternalSchema, type JsonSchema } from './json-schema'
import { legacyConfigToInternalSchema, type LegacyConfig } from './legacy'

export type SchemaInput = ZodTypeAny | JsonSchema | LegacyConfig | InternalSchema

function isZod(input: unknown): input is ZodTypeAny {
  return typeof input === 'object' && input !== null && '_def' in (input as object) && 'parse' in (input as object)
}

function isLegacy(input: unknown): input is LegacyConfig {
  if (typeof input !== 'object' || input === null) return false
  const obj = input as Record<string, unknown>
  return Array.isArray(obj.fields) && (obj.fields as unknown[]).every(
    (f) => typeof f === 'object' && f !== null && 'id' in (f as object) && 'type' in (f as object),
  )
}

function isJsonSchema(input: unknown): input is JsonSchema {
  if (typeof input !== 'object' || input === null) return false
  const obj = input as Record<string, unknown>
  return obj.type === 'object' || 'properties' in obj || '$schema' in obj
}

function isInternal(input: unknown): input is InternalSchema {
  if (typeof input !== 'object' || input === null) return false
  const obj = input as Record<string, unknown>
  return Array.isArray(obj.fields) && (obj.fields as unknown[]).every(
    (f) => typeof f === 'object' && f !== null && 'kind' in (f as object) && 'name' in (f as object),
  )
}

export function detectAndConvert(input: SchemaInput): InternalSchema {
  if (isZod(input)) return zodToInternalSchema(input)
  if (isInternal(input)) return input
  if (isLegacy(input)) {
    if (typeof console !== 'undefined') {
      console.warn('[react-dynamic-forms] Legacy config format is deprecated. Migrate to Zod or JSON Schema. See https://github.com/rogeroliveira84/react-dynamic-forms/blob/main/docs/migrate-from-v0.md')
    }
    return legacyConfigToInternalSchema(input)
  }
  if (isJsonSchema(input)) return jsonSchemaToInternalSchema(input)
  throw new Error('Unrecognized schema input — expected Zod, JSON Schema, or legacy config.')
}
```

- [ ] **Step 4: Run — expect pass**

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/adapters/detect*
git commit -m "feat(core): add runtime schema detector"
```

---

## Task 10: Core — `useDynamicForm` hook (TDD)

**Files:**
- Create: `packages/core/src/use-dynamic-form.ts`
- Create: `packages/core/src/use-dynamic-form.test.tsx`
- Create: `packages/core/src/schema-to-zod.ts` (helper to build a Zod validator from InternalSchema for non-Zod inputs)

- [ ] **Step 1: `schema-to-zod.ts`**

```ts
// packages/core/src/schema-to-zod.ts
import { z, type ZodTypeAny } from 'zod'
import type { FieldSpec, InternalSchema } from './internal-schema'

function fieldToZod(f: FieldSpec): ZodTypeAny {
  let s: ZodTypeAny
  switch (f.kind) {
    case 'text':
    case 'textarea':
    case 'password': {
      let str = z.string()
      if (f.minLength !== undefined) str = str.min(f.minLength)
      if (f.maxLength !== undefined) str = str.max(f.maxLength)
      if (f.pattern) str = str.regex(new RegExp(f.pattern))
      s = str
      break
    }
    case 'email': s = z.string().email(); break
    case 'url': s = z.string().url(); break
    case 'number':
    case 'slider': {
      let num = z.number()
      if (f.min !== undefined) num = num.min(f.min)
      if (f.max !== undefined) num = num.max(f.max)
      s = num
      break
    }
    case 'boolean': s = z.boolean(); break
    case 'date': s = z.coerce.date(); break
    case 'datetime': s = z.coerce.date(); break
    case 'time': s = z.string(); break
    case 'enum': s = z.union(f.options.map((o) => z.literal(o.value)) as [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]); break
    case 'multi-enum': s = z.array(z.union(f.options.map((o) => z.literal(o.value)) as [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]])); break
    case 'array': s = z.array(fieldToZod(f.item)); break
    case 'object': s = internalToZod({ fields: f.fields }); break
  }
  if (!f.required) s = s.optional()
  if (f.description) s = s.describe(f.description)
  return s
}

export function internalToZod(schema: InternalSchema): ZodTypeAny {
  const shape: Record<string, ZodTypeAny> = {}
  for (const f of schema.fields) shape[f.name] = fieldToZod(f)
  return z.object(shape)
}
```

- [ ] **Step 2: Write failing tests for hook**

```tsx
// packages/core/src/use-dynamic-form.test.tsx
import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { z } from 'zod'
import { useDynamicForm } from './use-dynamic-form'

describe('useDynamicForm', () => {
  it('returns internalSchema from Zod input', () => {
    const { result } = renderHook(() => useDynamicForm({ schema: z.object({ name: z.string() }) }))
    expect(result.current.internalSchema.fields[0]).toMatchObject({ name: 'name', kind: 'text' })
  })

  it('returns internalSchema from JSON Schema input', () => {
    const { result } = renderHook(() =>
      useDynamicForm({ schema: { type: 'object', properties: { age: { type: 'number' } } } }),
    )
    expect(result.current.internalSchema.fields[0]).toMatchObject({ name: 'age', kind: 'number' })
  })

  it('exposes react-hook-form API via form', () => {
    const { result } = renderHook(() => useDynamicForm({ schema: z.object({ a: z.string() }) }))
    expect(typeof result.current.form.register).toBe('function')
    expect(typeof result.current.form.handleSubmit).toBe('function')
  })
})
```

- [ ] **Step 3: Implement hook**

```ts
// packages/core/src/use-dynamic-form.ts
import { useMemo } from 'react'
import { useForm, type UseFormProps, type UseFormReturn, type FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { detectAndConvert, type SchemaInput } from './adapters/detect'
import { internalToZod } from './schema-to-zod'
import type { InternalSchema } from './internal-schema'
import type { ZodTypeAny } from 'zod'

export type UseDynamicFormOptions<TValues extends FieldValues = FieldValues> = {
  schema: SchemaInput
  defaultValues?: Partial<TValues>
  mode?: UseFormProps<TValues>['mode']
}

export type UseDynamicFormReturn<TValues extends FieldValues = FieldValues> = {
  form: UseFormReturn<TValues>
  internalSchema: InternalSchema
  zodSchema: ZodTypeAny
}

export function useDynamicForm<TValues extends FieldValues = FieldValues>(
  options: UseDynamicFormOptions<TValues>,
): UseDynamicFormReturn<TValues> {
  const internalSchema = useMemo(() => detectAndConvert(options.schema), [options.schema])
  const zodSchema = useMemo(() => {
    const input = options.schema
    if (typeof input === 'object' && input !== null && '_def' in (input as object) && 'parse' in (input as object)) {
      return input as ZodTypeAny
    }
    return internalToZod(internalSchema)
  }, [options.schema, internalSchema])

  const form = useForm<TValues>({
    resolver: zodResolver(zodSchema),
    defaultValues: options.defaultValues as UseFormProps<TValues>['defaultValues'],
    mode: options.mode ?? 'onBlur',
  })

  return { form, internalSchema, zodSchema }
}
```

- [ ] **Step 4: Run — expect pass**

```bash
pnpm --filter @rogeroliveira84/react-dynamic-forms test
```

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/use-dynamic-form* packages/core/src/schema-to-zod.ts
git commit -m "feat(core): add useDynamicForm hook + internalToZod helper"
```

---

## Task 11: Core — public exports

**Files:**
- Modify: `packages/core/src/index.ts`

- [ ] **Step 1: Update `index.ts`**

```ts
// packages/core/src/index.ts
export { useDynamicForm } from './use-dynamic-form'
export type { UseDynamicFormOptions, UseDynamicFormReturn } from './use-dynamic-form'
export { detectAndConvert } from './adapters/detect'
export type { SchemaInput } from './adapters/detect'
export { zodToInternalSchema } from './adapters/zod'
export { jsonSchemaToInternalSchema, type JsonSchema } from './adapters/json-schema'
export { legacyConfigToInternalSchema, type LegacyConfig, type LegacyField } from './adapters/legacy'
export { internalToZod } from './schema-to-zod'
export type {
  InternalSchema,
  FieldSpec,
  FieldKind,
  EnumOption,
  BaseFieldSpec,
  TextLikeFieldSpec,
  NumberFieldSpec,
  BooleanFieldSpec,
  DateFieldSpec,
  EnumFieldSpec,
  ObjectFieldSpec,
  ArrayFieldSpec,
} from './internal-schema'

export const VERSION = '1.0.0-next.0'
```

- [ ] **Step 2: Build and verify**

```bash
pnpm --filter @rogeroliveira84/react-dynamic-forms build
```
Expected: `dist/index.d.ts` exports the full API.

- [ ] **Step 3: Commit**

```bash
git add packages/core/src/index.ts
git commit -m "feat(core): wire up public exports"
```

---

## Task 12: `packages/ui` scaffold

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`
- Create: `packages/ui/tsup.config.ts`
- Create: `packages/ui/tailwind.config.ts`
- Create: `packages/ui/src/styles/globals.css`
- Create: `packages/ui/src/utils/cn.ts`
- Create: `packages/ui/src/index.ts`

- [ ] **Step 1: `packages/ui/package.json`**

```json
{
  "name": "@rogeroliveira84/react-dynamic-forms-ui",
  "version": "1.0.0-next.0",
  "description": "shadcn/ui components for react-dynamic-forms.",
  "license": "MIT",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./styles.css": "./dist/styles.css"
  },
  "files": ["dist", "README.md"],
  "sideEffects": ["**/*.css"],
  "scripts": {
    "build": "tsup && cp src/styles/globals.css dist/styles.css",
    "dev": "tsup --watch",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "lint": "eslint src"
  },
  "peerDependencies": {
    "@rogeroliveira84/react-dynamic-forms": "workspace:*",
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0",
    "react-hook-form": "^7.0.0"
  },
  "dependencies": {
    "@radix-ui/react-checkbox": "^1.1.2",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-radio-group": "^1.2.1",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-slider": "^1.2.1",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.460.0",
    "tailwind-merge": "^2.5.4"
  },
  "devDependencies": {
    "@rogeroliveira84/react-dynamic-forms": "workspace:*",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.53.2",
    "tailwindcss": "^3.4.15",
    "tsup": "^8.3.5",
    "typescript": "^5.6.3",
    "vitest": "^2.1.5",
    "zod": "^3.23.8"
  },
  "publishConfig": { "access": "public" }
}
```

- [ ] **Step 2: tsconfig + tsup**

```json
// packages/ui/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "dist", "rootDir": "src" },
  "include": ["src"]
}
```

```ts
// packages/ui/tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'react-hook-form', '@rogeroliveira84/react-dynamic-forms'],
})
```

- [ ] **Step 3: tailwind config**

```ts
// packages/ui/tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--rdf-border))',
        input: 'hsl(var(--rdf-input))',
        ring: 'hsl(var(--rdf-ring))',
        background: 'hsl(var(--rdf-background))',
        foreground: 'hsl(var(--rdf-foreground))',
        primary: { DEFAULT: 'hsl(var(--rdf-primary))', foreground: 'hsl(var(--rdf-primary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--rdf-destructive))', foreground: 'hsl(var(--rdf-destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--rdf-muted))', foreground: 'hsl(var(--rdf-muted-foreground))' },
      },
      borderRadius: { lg: 'var(--rdf-radius)', md: 'calc(var(--rdf-radius) - 2px)', sm: 'calc(var(--rdf-radius) - 4px)' },
    },
  },
} satisfies Config
```

- [ ] **Step 4: `globals.css` (shadcn default tokens with `rdf-` prefix)**

```css
/* packages/ui/src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --rdf-background: 0 0% 100%;
  --rdf-foreground: 222.2 84% 4.9%;
  --rdf-primary: 222.2 47.4% 11.2%;
  --rdf-primary-foreground: 210 40% 98%;
  --rdf-muted: 210 40% 96.1%;
  --rdf-muted-foreground: 215.4 16.3% 46.9%;
  --rdf-destructive: 0 84.2% 60.2%;
  --rdf-destructive-foreground: 210 40% 98%;
  --rdf-border: 214.3 31.8% 91.4%;
  --rdf-input: 214.3 31.8% 91.4%;
  --rdf-ring: 222.2 84% 4.9%;
  --rdf-radius: 0.5rem;
}

.dark {
  --rdf-background: 222.2 84% 4.9%;
  --rdf-foreground: 210 40% 98%;
  --rdf-primary: 210 40% 98%;
  --rdf-primary-foreground: 222.2 47.4% 11.2%;
  --rdf-muted: 217.2 32.6% 17.5%;
  --rdf-muted-foreground: 215 20.2% 65.1%;
  --rdf-destructive: 0 62.8% 30.6%;
  --rdf-destructive-foreground: 210 40% 98%;
  --rdf-border: 217.2 32.6% 17.5%;
  --rdf-input: 217.2 32.6% 17.5%;
  --rdf-ring: 212.7 26.8% 83.9%;
}
```

- [ ] **Step 5: `cn` helper**

```ts
// packages/ui/src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 6: `index.ts` stub**

```ts
// packages/ui/src/index.ts
export { cn } from './utils/cn'
```

- [ ] **Step 7: Install and commit**

```bash
pnpm install
git add -A
git commit -m "feat(ui): scaffold UI package with Tailwind + tsup + shadcn tokens"
```

---

## Task 13: UI primitives (Input, Label, Button, Checkbox, Select, Switch, Textarea, Slider, RadioGroup)

**Files:**
- Create: `packages/ui/src/primitives/input.tsx`
- Create: `packages/ui/src/primitives/label.tsx`
- Create: `packages/ui/src/primitives/button.tsx`
- Create: `packages/ui/src/primitives/checkbox.tsx`
- Create: `packages/ui/src/primitives/select.tsx`
- Create: `packages/ui/src/primitives/switch.tsx`
- Create: `packages/ui/src/primitives/textarea.tsx`
- Create: `packages/ui/src/primitives/slider.tsx`
- Create: `packages/ui/src/primitives/radio-group.tsx`

These are standard shadcn/ui components. Copy their current canonical implementations from the shadcn registry, but use the `--rdf-*` CSS variables. Because these are well-known public components, we copy verbatim with the prefix swap.

**Single-step tasks (each primitive is a file copy-adapt):**

- [ ] **Step 1: `input.tsx`**

```tsx
// packages/ui/src/primitives/input.tsx
import * as React from 'react'
import { cn } from '../utils/cn'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  />
))
Input.displayName = 'Input'
```

- [ ] **Step 2: `label.tsx`**

```tsx
// packages/ui/src/primitives/label.tsx
import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const labelVariants = cva('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70')

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
))
Label.displayName = LabelPrimitive.Root.displayName
```

- [ ] **Step 3: `button.tsx`**

```tsx
// packages/ui/src/primitives/button.tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-muted hover:text-foreground',
        ghost: 'hover:bg-muted hover:text-foreground',
      },
      size: { default: 'h-10 px-4 py-2', sm: 'h-9 px-3', lg: 'h-11 px-8', icon: 'h-10 w-10' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = 'Button'
```

- [ ] **Step 4: `checkbox.tsx`**

```tsx
// packages/ui/src/primitives/checkbox.tsx
import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '../utils/cn'

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName
```

- [ ] **Step 5: `select.tsx`**

```tsx
// packages/ui/src/primitives/select.tsx
import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '../utils/cn'

export const Select = SelectPrimitive.Root
export const SelectValue = SelectPrimitive.Value

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      '[&>span]:line-clamp-1',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-background text-foreground shadow-md',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.Viewport className={cn('p-1', position === 'popper' && 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]')}>
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
      'focus:bg-muted focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName
```

- [ ] **Step 6: `switch.tsx`**

```tsx
// packages/ui/src/primitives/switch.tsx
import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '../utils/cn'

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted',
      className,
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb className={cn('pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform', 'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0')} />
  </SwitchPrimitive.Root>
))
Switch.displayName = SwitchPrimitive.Root.displayName
```

- [ ] **Step 7: `textarea.tsx`**

```tsx
// packages/ui/src/primitives/textarea.tsx
import * as React from 'react'
import { cn } from '../utils/cn'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  />
))
Textarea.displayName = 'Textarea'
```

- [ ] **Step 8: `slider.tsx`**

```tsx
// packages/ui/src/primitives/slider.tsx
import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '../utils/cn'

export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none select-none items-center', className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName
```

- [ ] **Step 9: `radio-group.tsx`**

```tsx
// packages/ui/src/primitives/radio-group.tsx
import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Circle } from 'lucide-react'
import { cn } from '../utils/cn'

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={cn('grid gap-2', className)} {...props} />
))
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <Circle className="h-2.5 w-2.5 fill-current text-current" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
))
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName
```

- [ ] **Step 10: Commit**

```bash
git add packages/ui/src/primitives
git commit -m "feat(ui): add shadcn primitives (Input, Label, Button, Checkbox, Select, Switch, Textarea, Slider, RadioGroup)"
```

---

## Task 14: UI — FieldWrapper + field resolver

**Files:**
- Create: `packages/ui/src/fields/field-wrapper.tsx`
- Create: `packages/ui/src/fields/text-field.tsx`
- Create: `packages/ui/src/fields/number-field.tsx`
- Create: `packages/ui/src/fields/boolean-field.tsx`
- Create: `packages/ui/src/fields/date-field.tsx`
- Create: `packages/ui/src/fields/textarea-field.tsx`
- Create: `packages/ui/src/fields/enum-field.tsx`
- Create: `packages/ui/src/fields/multi-enum-field.tsx`
- Create: `packages/ui/src/fields/slider-field.tsx`
- Create: `packages/ui/src/fields/object-field.tsx`
- Create: `packages/ui/src/fields/array-field.tsx`
- Create: `packages/ui/src/fields/field-resolver.tsx`

- [ ] **Step 1: `field-wrapper.tsx`**

```tsx
// packages/ui/src/fields/field-wrapper.tsx
import * as React from 'react'
import { Label } from '../primitives/label'
import { cn } from '../utils/cn'

export type FieldWrapperProps = {
  id: string
  label?: string
  description?: string
  required?: boolean
  error?: string
  children: React.ReactNode
  className?: string
  layout?: 'label-top' | 'label-inline'
}

export function FieldWrapper({ id, label, description, required, error, children, className, layout = 'label-top' }: FieldWrapperProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', layout === 'label-inline' && 'flex-row items-center gap-3', className)}>
      {label && (
        <Label htmlFor={id} className={cn(error && 'text-destructive')}>
          {label}
          {required && <span aria-hidden="true" className="ml-0.5 text-destructive">*</span>}
        </Label>
      )}
      <div className="flex flex-col gap-1">
        {children}
        {description && !error && <p className="text-xs text-muted-foreground">{description}</p>}
        {error && <p className="text-xs text-destructive" role="alert">{error}</p>}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: `text-field.tsx`**

```tsx
// packages/ui/src/fields/text-field.tsx
import type { TextLikeFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { useFormContext } from 'react-hook-form'
import { Input } from '../primitives/input'
import { FieldWrapper } from './field-wrapper'

const HTML_TYPE_MAP: Record<string, string> = {
  text: 'text', email: 'email', password: 'password', url: 'url', textarea: 'text',
}

export function TextField({ field }: { field: TextLikeFieldSpec }) {
  const { register, formState: { errors } } = useFormContext()
  const error = errors[field.name]?.message as string | undefined
  return (
    <FieldWrapper id={field.name} label={field.label ?? field.name} description={field.description} required={field.required} error={error}>
      <Input
        id={field.name}
        type={HTML_TYPE_MAP[field.kind] ?? 'text'}
        placeholder={field.placeholder}
        {...register(field.name)}
      />
    </FieldWrapper>
  )
}
```

- [ ] **Step 3: `number-field.tsx`**

```tsx
// packages/ui/src/fields/number-field.tsx
import type { NumberFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { useFormContext } from 'react-hook-form'
import { Input } from '../primitives/input'
import { FieldWrapper } from './field-wrapper'

export function NumberField({ field }: { field: NumberFieldSpec }) {
  const { register, formState: { errors } } = useFormContext()
  const error = errors[field.name]?.message as string | undefined
  return (
    <FieldWrapper id={field.name} label={field.label ?? field.name} description={field.description} required={field.required} error={error}>
      <Input
        id={field.name}
        type="number"
        min={field.min}
        max={field.max}
        step={field.step}
        placeholder={field.placeholder}
        {...register(field.name, { valueAsNumber: true })}
      />
    </FieldWrapper>
  )
}
```

- [ ] **Step 4: `textarea-field.tsx`**

```tsx
// packages/ui/src/fields/textarea-field.tsx
import type { TextLikeFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { useFormContext } from 'react-hook-form'
import { Textarea } from '../primitives/textarea'
import { FieldWrapper } from './field-wrapper'

export function TextareaField({ field }: { field: TextLikeFieldSpec }) {
  const { register, formState: { errors } } = useFormContext()
  const error = errors[field.name]?.message as string | undefined
  return (
    <FieldWrapper id={field.name} label={field.label ?? field.name} description={field.description} required={field.required} error={error}>
      <Textarea id={field.name} placeholder={field.placeholder} {...register(field.name)} />
    </FieldWrapper>
  )
}
```

- [ ] **Step 5: `boolean-field.tsx`**

```tsx
// packages/ui/src/fields/boolean-field.tsx
import type { BooleanFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { Controller, useFormContext } from 'react-hook-form'
import { Checkbox } from '../primitives/checkbox'
import { FieldWrapper } from './field-wrapper'

export function BooleanField({ field }: { field: BooleanFieldSpec }) {
  const { control, formState: { errors } } = useFormContext()
  const error = errors[field.name]?.message as string | undefined
  return (
    <FieldWrapper id={field.name} label={field.label ?? field.name} description={field.description} required={field.required} error={error} layout="label-inline">
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhf }) => (
          <Checkbox id={field.name} checked={Boolean(rhf.value)} onCheckedChange={(v) => rhf.onChange(Boolean(v))} />
        )}
      />
    </FieldWrapper>
  )
}
```

- [ ] **Step 6: `date-field.tsx`**

```tsx
// packages/ui/src/fields/date-field.tsx
import type { DateFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { useFormContext } from 'react-hook-form'
import { Input } from '../primitives/input'
import { FieldWrapper } from './field-wrapper'

const HTML_TYPE: Record<DateFieldSpec['kind'], string> = {
  date: 'date',
  datetime: 'datetime-local',
  time: 'time',
}

export function DateField({ field }: { field: DateFieldSpec }) {
  const { register, formState: { errors } } = useFormContext()
  const error = errors[field.name]?.message as string | undefined
  return (
    <FieldWrapper id={field.name} label={field.label ?? field.name} description={field.description} required={field.required} error={error}>
      <Input id={field.name} type={HTML_TYPE[field.kind]} min={field.min} max={field.max} {...register(field.name)} />
    </FieldWrapper>
  )
}
```

- [ ] **Step 7: `enum-field.tsx`**

```tsx
// packages/ui/src/fields/enum-field.tsx
import type { EnumFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { Controller, useFormContext } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../primitives/select'
import { FieldWrapper } from './field-wrapper'

export function EnumField({ field }: { field: EnumFieldSpec }) {
  const { control, formState: { errors } } = useFormContext()
  const error = errors[field.name]?.message as string | undefined
  return (
    <FieldWrapper id={field.name} label={field.label ?? field.name} description={field.description} required={field.required} error={error}>
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhf }) => (
          <Select value={String(rhf.value ?? '')} onValueChange={rhf.onChange}>
            <SelectTrigger id={field.name}>
              <SelectValue placeholder={field.placeholder ?? 'Select…'} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((opt) => (
                <SelectItem key={String(opt.value)} value={String(opt.value)}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FieldWrapper>
  )
}
```

- [ ] **Step 8: `multi-enum-field.tsx` (simple checkbox grid, not combobox)**

```tsx
// packages/ui/src/fields/multi-enum-field.tsx
import type { EnumFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { Controller, useFormContext } from 'react-hook-form'
import { Checkbox } from '../primitives/checkbox'
import { Label } from '../primitives/label'
import { FieldWrapper } from './field-wrapper'

export function MultiEnumField({ field }: { field: EnumFieldSpec }) {
  const { control, formState: { errors } } = useFormContext()
  const error = errors[field.name]?.message as string | undefined
  return (
    <FieldWrapper id={field.name} label={field.label ?? field.name} description={field.description} required={field.required} error={error}>
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhf }) => {
          const value: (string | number)[] = Array.isArray(rhf.value) ? rhf.value : []
          const toggle = (v: string | number) => {
            const has = value.includes(v)
            rhf.onChange(has ? value.filter((x) => x !== v) : [...value, v])
          }
          return (
            <div className="flex flex-col gap-2">
              {field.options.map((opt) => {
                const id = `${field.name}-${String(opt.value)}`
                return (
                  <div key={id} className="flex items-center gap-2">
                    <Checkbox id={id} checked={value.includes(opt.value)} onCheckedChange={() => toggle(opt.value)} />
                    <Label htmlFor={id}>{opt.label}</Label>
                  </div>
                )
              })}
            </div>
          )
        }}
      />
    </FieldWrapper>
  )
}
```

- [ ] **Step 9: `slider-field.tsx`**

```tsx
// packages/ui/src/fields/slider-field.tsx
import type { NumberFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { Controller, useFormContext } from 'react-hook-form'
import { Slider } from '../primitives/slider'
import { FieldWrapper } from './field-wrapper'

export function SliderField({ field }: { field: NumberFieldSpec }) {
  const { control, formState: { errors } } = useFormContext()
  const error = errors[field.name]?.message as string | undefined
  return (
    <FieldWrapper id={field.name} label={field.label ?? field.name} description={field.description} required={field.required} error={error}>
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhf }) => (
          <Slider
            id={field.name}
            min={field.min ?? 0}
            max={field.max ?? 100}
            step={field.step ?? 1}
            value={[typeof rhf.value === 'number' ? rhf.value : field.min ?? 0]}
            onValueChange={(v) => rhf.onChange(v[0])}
          />
        )}
      />
    </FieldWrapper>
  )
}
```

- [ ] **Step 10: `object-field.tsx`**

```tsx
// packages/ui/src/fields/object-field.tsx
import type { ObjectFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { FieldWrapper } from './field-wrapper'
import { FieldResolver } from './field-resolver'

export function ObjectField({ field, parentName }: { field: ObjectFieldSpec; parentName?: string }) {
  const prefix = parentName ? `${parentName}.${field.name}` : field.name
  return (
    <FieldWrapper id={field.name} label={field.label ?? field.name} description={field.description}>
      <div className="flex flex-col gap-4 rounded-md border border-border p-4">
        {field.fields.map((f) => (
          <FieldResolver key={`${prefix}.${f.name}`} field={{ ...f, name: `${prefix}.${f.name}` }} />
        ))}
      </div>
    </FieldWrapper>
  )
}
```

- [ ] **Step 11: `array-field.tsx`**

```tsx
// packages/ui/src/fields/array-field.tsx
import type { ArrayFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '../primitives/button'
import { FieldWrapper } from './field-wrapper'
import { FieldResolver } from './field-resolver'

export function ArrayField({ field }: { field: ArrayFieldSpec }) {
  const { control, formState: { errors } } = useFormContext()
  const { fields, append, remove } = useFieldArray({ control, name: field.name })
  const error = errors[field.name]?.message as string | undefined

  return (
    <FieldWrapper id={field.name} label={field.label ?? field.name} description={field.description} required={field.required} error={error}>
      <div className="flex flex-col gap-3">
        {fields.map((f, i) => (
          <div key={f.id} className="flex items-start gap-2">
            <div className="flex-1">
              <FieldResolver field={{ ...field.item, name: `${field.name}.${i}` }} />
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => remove(i)}>Remove</Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => append('' as unknown as never)}>+ Add</Button>
      </div>
    </FieldWrapper>
  )
}
```

- [ ] **Step 12: `field-resolver.tsx`**

```tsx
// packages/ui/src/fields/field-resolver.tsx
import type { FieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { TextField } from './text-field'
import { NumberField } from './number-field'
import { BooleanField } from './boolean-field'
import { DateField } from './date-field'
import { TextareaField } from './textarea-field'
import { EnumField } from './enum-field'
import { MultiEnumField } from './multi-enum-field'
import { SliderField } from './slider-field'
import { ObjectField } from './object-field'
import { ArrayField } from './array-field'

export function FieldResolver({ field }: { field: FieldSpec }) {
  if (field.hidden) return null
  switch (field.kind) {
    case 'text':
    case 'email':
    case 'password':
    case 'url':
      return <TextField field={field} />
    case 'textarea': return <TextareaField field={field} />
    case 'number': return <NumberField field={field} />
    case 'slider': return <SliderField field={field} />
    case 'boolean': return <BooleanField field={field} />
    case 'date':
    case 'datetime':
    case 'time':
      return <DateField field={field} />
    case 'enum': return <EnumField field={field} />
    case 'multi-enum': return <MultiEnumField field={field} />
    case 'object': return <ObjectField field={field} />
    case 'array': return <ArrayField field={field} />
  }
}
```

- [ ] **Step 13: Commit**

```bash
git add packages/ui/src/fields
git commit -m "feat(ui): add field components + FieldResolver for all InternalSchema kinds"
```

---

## Task 15: UI — `<DynamicForm>` main component

**Files:**
- Create: `packages/ui/src/dynamic-form.tsx`
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: `dynamic-form.tsx`**

```tsx
// packages/ui/src/dynamic-form.tsx
import { FormProvider, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { useDynamicForm, type SchemaInput } from '@rogeroliveira84/react-dynamic-forms'
import { Button } from './primitives/button'
import { FieldResolver } from './fields/field-resolver'
import { cn } from './utils/cn'

export type DynamicFormProps<TValues extends FieldValues = FieldValues> = {
  schema: SchemaInput
  onSubmit: SubmitHandler<TValues>
  defaultValues?: Partial<TValues>
  submitLabel?: string
  className?: string
  title?: string
  description?: string
  showSubmit?: boolean
  /** Legacy prop from v0.5 — renamed to `schema` */
  config?: SchemaInput
}

export function DynamicForm<TValues extends FieldValues = FieldValues>(props: DynamicFormProps<TValues>) {
  const actualSchema = props.schema ?? props.config
  if (!actualSchema) throw new Error('DynamicForm requires a `schema` prop.')
  if (props.config && !props.schema && typeof console !== 'undefined') {
    console.warn('[react-dynamic-forms] `config` prop is deprecated — rename to `schema`. See migration guide.')
  }

  const { form, internalSchema } = useDynamicForm<TValues>({
    schema: actualSchema,
    defaultValues: props.defaultValues,
  })

  const title = props.title ?? internalSchema.title
  const description = props.description ?? internalSchema.description

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(props.onSubmit)}
        className={cn('flex flex-col gap-4', props.className)}
        noValidate
      >
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {internalSchema.fields.map((f) => (
          <FieldResolver key={f.name} field={f} />
        ))}
        {props.showSubmit !== false && (
          <div className="mt-2">
            <Button type="submit">{props.submitLabel ?? 'Submit'}</Button>
          </div>
        )}
      </form>
    </FormProvider>
  )
}
```

- [ ] **Step 2: Update `packages/ui/src/index.ts`**

```ts
// packages/ui/src/index.ts
export { DynamicForm, type DynamicFormProps } from './dynamic-form'
export { FieldResolver } from './fields/field-resolver'
export { FieldWrapper, type FieldWrapperProps } from './fields/field-wrapper'
export * from './primitives/input'
export * from './primitives/label'
export * from './primitives/button'
export * from './primitives/checkbox'
export * from './primitives/select'
export * from './primitives/switch'
export * from './primitives/textarea'
export * from './primitives/slider'
export * from './primitives/radio-group'
export { cn } from './utils/cn'
```

- [ ] **Step 3: Build**

```bash
pnpm --filter @rogeroliveira84/react-dynamic-forms-ui build
```
Expected: `dist/index.js`, `dist/index.d.ts`, `dist/styles.css` all created.

- [ ] **Step 4: Commit**

```bash
git add packages/ui/src/dynamic-form.tsx packages/ui/src/index.ts
git commit -m "feat(ui): add <DynamicForm> orchestrator + public exports"
```

---

## Task 16: UI — smoke test via RTL

**Files:**
- Create: `packages/ui/src/dynamic-form.test.tsx`
- Create: `packages/ui/vitest.config.ts`
- Create: `packages/ui/src/test-setup.ts`
- Create: `packages/ui/postcss.config.cjs`

- [ ] **Step 1: postcss config**

```js
// packages/ui/postcss.config.cjs
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }
```

- [ ] **Step 2: vitest config + setup**

```ts
// packages/ui/vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
```

```ts
// packages/ui/src/test-setup.ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 3: Smoke test**

```tsx
// packages/ui/src/dynamic-form.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { z } from 'zod'
import { DynamicForm } from './dynamic-form'

describe('<DynamicForm>', () => {
  it('renders fields from a Zod schema', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
      subscribe: z.boolean(),
    })
    render(<DynamicForm schema={schema} onSubmit={() => {}} />)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/subscribe/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('submits valid values', async () => {
    const onSubmit = vi.fn()
    const schema = z.object({ email: z.string().email() })
    render(<DynamicForm schema={schema} onSubmit={onSubmit} />)
    await userEvent.type(screen.getByLabelText(/email/i), 'x@y.com')
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ email: 'x@y.com' }), expect.anything())
  })

  it('shows validation error for invalid email', async () => {
    const schema = z.object({ email: z.string().email() })
    render(<DynamicForm schema={schema} onSubmit={() => {}} />)
    await userEvent.type(screen.getByLabelText(/email/i), 'not-email')
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('renders from JSON Schema input', () => {
    const jsonSchema = {
      type: 'object',
      properties: { title: { type: 'string', description: 'Document title' } },
      required: ['title'],
    } as const
    render(<DynamicForm schema={jsonSchema} onSubmit={() => {}} />)
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
  })

  it('renders from legacy config with deprecation warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const legacy = {
      name: 'Legacy',
      fields: [{ id: 'nm', label: 'NM', type: 'text', value: '', required: 'false' }],
    }
    render(<DynamicForm schema={legacy as any} onSubmit={() => {}} />)
    expect(screen.getByLabelText(/nm/i)).toBeInTheDocument()
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Legacy config format is deprecated'))
    warn.mockRestore()
  })
})
```

- [ ] **Step 4: Run tests**

```bash
pnpm --filter @rogeroliveira84/react-dynamic-forms-ui test
```
Expected: 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/ui
git commit -m "test(ui): smoke tests for DynamicForm across schema inputs"
```

---

## Task 17: `packages/ai` placeholder

**Files:**
- Create: `packages/ai/package.json`
- Create: `packages/ai/tsconfig.json`
- Create: `packages/ai/tsup.config.ts`
- Create: `packages/ai/src/index.ts`
- Create: `packages/ai/README.md`

- [ ] **Step 1: package files**

```json
// packages/ai/package.json
{
  "name": "@rogeroliveira84/react-dynamic-forms-ai",
  "version": "0.0.0",
  "description": "AI-powered schema generation for react-dynamic-forms (v2 preview).",
  "license": "MIT",
  "type": "module",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "tsup": "^8.3.5",
    "typescript": "^5.6.3"
  }
}
```

```json
// packages/ai/tsconfig.json
{ "extends": "../../tsconfig.base.json", "compilerOptions": { "outDir": "dist", "rootDir": "src" }, "include": ["src"] }
```

```ts
// packages/ai/tsup.config.ts
import { defineConfig } from 'tsup'
export default defineConfig({ entry: ['src/index.ts'], format: ['esm'], dts: true, clean: true })
```

```ts
// packages/ai/src/index.ts
/**
 * @rogeroliveira84/react-dynamic-forms-ai
 *
 * v2 preview — coming soon.
 * Will expose generateSchema({ prompt, from, model }) returning a Zod schema.
 * See docs/superpowers/specs/2026-04-19-rdf-modernization-design.md §13.
 */
export const VERSION = '0.0.0'
```

```md
// packages/ai/README.md
# @rogeroliveira84/react-dynamic-forms-ai

> Placeholder for v2. AI-powered schema generation — stay tuned.
```

- [ ] **Step 2: Commit**

```bash
git add packages/ai
git commit -m "feat(ai): placeholder package for v2 AI generator"
```

---

## Task 18: `apps/demo` (Vite + React 19)

**Files:**
- Create: `apps/demo/package.json`
- Create: `apps/demo/tsconfig.json`
- Create: `apps/demo/vite.config.ts`
- Create: `apps/demo/index.html`
- Create: `apps/demo/tailwind.config.ts`
- Create: `apps/demo/postcss.config.cjs`
- Create: `apps/demo/src/main.tsx`
- Create: `apps/demo/src/App.tsx`
- Create: `apps/demo/src/styles.css`
- Create: `apps/demo/src/examples/zod-example.ts`
- Create: `apps/demo/src/examples/json-schema-example.ts`
- Create: `apps/demo/src/examples/legacy-example.ts`

- [ ] **Step 1: `package.json`**

```json
{
  "name": "demo",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@rogeroliveira84/react-dynamic-forms": "workspace:*",
    "@rogeroliveira84/react-dynamic-forms-ui": "workspace:*",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.53.2",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.3",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.15",
    "typescript": "^5.6.3",
    "vite": "^5.4.11"
  }
}
```

- [ ] **Step 2: `vite.config.ts` + `tsconfig.json`**

```ts
// apps/demo/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ plugins: [react()] })
```

```json
// apps/demo/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "noEmit": true },
  "include": ["src"]
}
```

- [ ] **Step 3: `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Dynamic Forms — Demo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Tailwind config + postcss + styles**

```ts
// apps/demo/tailwind.config.ts
import type { Config } from 'tailwindcss'
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: { extend: {} },
} satisfies Config
```

```js
// apps/demo/postcss.config.cjs
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }
```

```css
/* apps/demo/src/styles.css */
@import '@rogeroliveira84/react-dynamic-forms-ui/styles.css';

body { @apply bg-background text-foreground antialiased; font-family: ui-sans-serif, system-ui, sans-serif; }
.container { @apply mx-auto max-w-2xl px-4 py-10; }
```

- [ ] **Step 5: `main.tsx`**

```tsx
// apps/demo/src/main.tsx
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(<App />)
```

- [ ] **Step 6: Example schemas**

```ts
// apps/demo/src/examples/zod-example.ts
import { z } from 'zod'

export const zodExample = z.object({
  fullName: z.string().min(2).describe('Your full name'),
  email: z.string().email().describe('Email address'),
  age: z.number().min(18).max(120),
  country: z.enum(['BR', 'US', 'PT']),
  subscribe: z.boolean().optional(),
  bio: z.string().max(500).optional().describe('Tell us about yourself'),
})
```

```ts
// apps/demo/src/examples/json-schema-example.ts
export const jsonSchemaExample = {
  title: 'Product',
  type: 'object',
  properties: {
    name: { type: 'string', title: 'Product name' },
    price: { type: 'number', minimum: 0, title: 'Price (USD)' },
    inStock: { type: 'boolean', title: 'In stock' },
    category: { type: 'string', enum: ['A', 'B', 'C'], title: 'Category' },
  },
  required: ['name', 'price'],
} as const
```

```ts
// apps/demo/src/examples/legacy-example.ts
import type { LegacyConfig } from '@rogeroliveira84/react-dynamic-forms'

export const legacyExample: LegacyConfig = {
  name: 'Client Register (v0.5 legacy)',
  fields: [
    { id: 'fullname', label: 'Full Name', type: 'text', required: 'true', value: '', placeholder: 'Type your name…' },
    { id: 'dateOfBirth', label: 'Date Of Birth', type: 'date', required: 'false', value: '' },
    {
      id: 'favoriteFruit', label: 'Favorite Fruit', type: 'array', required: 'false', value: '',
      definition: {
        options: [
          { id: 1, display: 'Apple' },
          { id: 2, display: 'Banana' },
          { id: 3, display: 'Watermelon' },
        ],
      },
    },
  ],
}
```

- [ ] **Step 7: `App.tsx`**

```tsx
// apps/demo/src/App.tsx
import { useState } from 'react'
import { DynamicForm } from '@rogeroliveira84/react-dynamic-forms-ui'
import { zodExample } from './examples/zod-example'
import { jsonSchemaExample } from './examples/json-schema-example'
import { legacyExample } from './examples/legacy-example'

const tabs = {
  zod: { label: 'Zod', schema: zodExample },
  json: { label: 'JSON Schema', schema: jsonSchemaExample },
  legacy: { label: 'Legacy v0.5', schema: legacyExample },
} as const

type Tab = keyof typeof tabs

export default function App() {
  const [tab, setTab] = useState<Tab>('zod')
  const [output, setOutput] = useState<unknown>(null)

  return (
    <div className="container">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">React Dynamic Forms</h1>
        <p className="text-muted-foreground">Zod-powered dynamic React forms. Try each schema input below.</p>
      </header>

      <nav className="mb-6 flex gap-2 border-b border-border pb-2">
        {(Object.keys(tabs) as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setOutput(null) }}
            className={`rounded px-3 py-1.5 text-sm ${tab === t ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
          >
            {tabs[t].label}
          </button>
        ))}
      </nav>

      <section className="rounded-md border border-border p-6">
        <DynamicForm schema={tabs[tab].schema} onSubmit={(data) => setOutput(data)} />
      </section>

      {output !== null && (
        <section className="mt-6 rounded-md border border-border p-4">
          <h3 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">Submitted</h3>
          <pre className="overflow-auto text-xs">{JSON.stringify(output, null, 2)}</pre>
        </section>
      )}
    </div>
  )
}
```

- [ ] **Step 8: Install, run dev server once to verify**

```bash
pnpm install
pnpm --filter demo build
```
Expected: build succeeds, `apps/demo/dist/` exists.

- [ ] **Step 9: Commit**

```bash
git add apps/demo
git commit -m "feat(demo): Vite + React 19 demo with Zod / JSON Schema / legacy examples"
```

---

## Task 19: Root dev/build scripts + cleanup of old `src/`

**Files:**
- Delete: `src/` (old CRA source)
- Delete: `public/` (old CRA public)
- Delete: root `package-lock.json` (already gone)
- Modify: root `package.json` (add `filter` aliases)

- [ ] **Step 1: Remove old CRA leftovers**

```bash
rm -rf src public
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "chore: remove legacy CRA src/ and public/ (migrated to monorepo)"
```

---

## Task 20: GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: `ci.yml`**

```yaml
name: CI

on:
  push: { branches: [main, master] }
  pull_request: { branches: [main, master] }

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm -w turbo typecheck
      - run: pnpm -w turbo test
      - run: pnpm -w turbo build
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions workflow (typecheck + test + build on Node 20/22)"
```

---

## Task 21: Changesets setup

**Files:**
- Create: `.changeset/config.json`
- Create: `.changeset/README.md`
- Create: `.github/workflows/release.yml`
- Create: `.changeset/v1-foundation.md` (first changeset)

- [ ] **Step 1: `config.json`**

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.4/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [["@rogeroliveira84/react-dynamic-forms", "@rogeroliveira84/react-dynamic-forms-ui"]],
  "access": "public",
  "baseBranch": "master",
  "updateInternalDependencies": "patch",
  "ignore": ["demo", "docs", "@rogeroliveira84/react-dynamic-forms-ai"]
}
```

- [ ] **Step 2: `release.yml`**

```yaml
name: Release

on:
  push: { branches: [master] }

concurrency: release

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
          registry-url: https://registry.npmjs.org
      - run: pnpm install --frozen-lockfile
      - run: pnpm -w turbo build --filter=./packages/*
      - uses: changesets/action@v1
        with:
          publish: pnpm release
          version: pnpm version-packages
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

- [ ] **Step 3: First changeset**

```md
// .changeset/v1-foundation.md
---
"@rogeroliveira84/react-dynamic-forms": major
"@rogeroliveira84/react-dynamic-forms-ui": major
---

# v1.0.0 — Foundation

React Dynamic Forms is reborn as a modern Zod-first dynamic form library.

- Monorepo architecture (pnpm + Turborepo)
- React 19 + TypeScript strict
- Hybrid schema input: Zod, JSON Schema Draft 2020-12, or legacy v0.5 config
- shadcn/ui components, Tailwind-based, headless-friendly
- react-hook-form under the hood with automatic Zod validation
- Tree-shakable, < 15 kb gzipped core
- Full field support: text, email, password, url, number, slider, textarea, boolean, date, datetime, time, enum, multi-enum, object (nested), array (repeater)
- Breaking change: `config` prop renamed to `schema` (legacy `config` kept with deprecation warning, removed in v2)

See migration guide: `docs/migrate-from-v0.md`
```

- [ ] **Step 4: Commit**

```bash
git add .changeset .github/workflows/release.yml
git commit -m "ci: add Changesets + release workflow"
```

---

## Task 22: `.claude/` folder

**Files:**
- Create: `.claude/CLAUDE.md`
- Create: `.claude/settings.json`
- Create: `.claude/commands/release.md`
- Create: `.claude/commands/new-field.md`
- Create: `.claude/commands/new-example.md`
- Create: `.claude/commands/schema-adapter.md`
- Create: `.claude/agents/form-field-builder.md`
- Create: `.claude/agents/docs-writer.md`

- [ ] **Step 1: `CLAUDE.md`**

```markdown
# CLAUDE.md — React Dynamic Forms

Project-level context for AI coding agents. Read this first.

## What this project is

**`@rogeroliveira84/react-dynamic-forms`** — a Zod-first dynamic React form library. Pass a schema (Zod, JSON Schema Draft 2020-12, or legacy v0.5 config), get a fully-validated form rendered with shadcn/ui.

Repo was a CRA learning project; v1 is a from-scratch modernization toward a publishable npm library. v2 (future) adds AI-powered schema generation. See `docs/superpowers/specs/2026-04-19-rdf-modernization-design.md`.

## Stack

- **Runtime:** React 19, TypeScript 5.6 (strict)
- **Monorepo:** pnpm workspaces + Turborepo
- **Validation:** Zod 3.23+ + `@hookform/resolvers`
- **Forms:** react-hook-form 7
- **UI:** shadcn/ui (Radix + Tailwind 3) — with migration to Tailwind 4 noted
- **Build:** tsup (libs), Vite (demo), Next.js 15 (docs — stub for v1)
- **Test:** Vitest + React Testing Library (+ Playwright for v2 e2e)
- **Release:** Changesets + GitHub Actions

## Monorepo map

| Path | Contents |
|---|---|
| `packages/core` | `@rogeroliveira84/react-dynamic-forms` — schema adapters, `InternalSchema`, `useDynamicForm` hook |
| `packages/ui` | `@rogeroliveira84/react-dynamic-forms-ui` — shadcn field components + `<DynamicForm>` |
| `packages/ai` | Placeholder for v2 AI generator |
| `apps/demo` | Vite demo showing Zod / JSON Schema / legacy examples |
| `apps/docs` | Next.js docs site (stub in v1, flesh out in v2) |

## How to run

```bash
pnpm install              # one-time
pnpm dev                  # all dev servers in parallel
pnpm --filter demo dev    # just the Vite demo
pnpm test                 # all tests via Turbo
pnpm typecheck            # all packages
pnpm build                # build all packages
pnpm changeset            # create a changeset for release
```

## Coding conventions

- **Strict TS everywhere.** No `any` unless unavoidable (and explain why in a comment).
- **No default exports** — makes refactors and auto-imports cleaner.
- **Co-locate tests.** `foo.ts` tested by `foo.test.ts` in the same folder.
- **Pure logic in `core`, UI in `ui`.** Never import from `ui` in `core`.
- **Field kinds** are exhaustive in `InternalSchema`. Adding a new kind = update `FieldKind` union + `FieldResolver` switch + adapter mappings + test.
- **Prefer `z.describe()` over manual label metadata** for Zod users — the adapter reads it.
- **React: function components only. No classes. Use `React.forwardRef` when props include `ref`.**

## Common tasks

### Add a new field kind (e.g., `color`)
1. Add to `FieldKind` union in `packages/core/src/internal-schema.ts`.
2. Extend `FieldSpec` with the new spec.
3. Update `zodToInternalSchema`, `jsonSchemaToInternalSchema`, `legacyConfigToInternalSchema` with detection + tests.
4. Add `internalToZod` mapping.
5. Create `packages/ui/src/fields/color-field.tsx`.
6. Add case to `field-resolver.tsx`.
7. Update README + demo example.
8. Changeset.

(Use the `/new-field` command — it guides this flow.)

### Add a new schema adapter (e.g., OpenAPI)
1. Create `packages/core/src/adapters/openapi.ts` + `.test.ts`.
2. Export from `index.ts`.
3. Extend `detectAndConvert` with new detector.

Use `/schema-adapter`.

## Release process

1. Create a changeset: `pnpm changeset`
2. Commit the `.changeset/*.md` file.
3. When merged to `master`, the release workflow opens a "Version Packages" PR.
4. Merge that PR → auto-publishes to npm.

## Forbidden

- ❌ Enzyme (migrated to RTL)
- ❌ `react-scripts` / CRA (migrated to Vite + Next.js)
- ❌ `ReactDOM.render` (use `createRoot`)
- ❌ PropTypes (use TypeScript)
- ❌ Default React exports
- ❌ Bootstrap (migrated to shadcn)
- ❌ Hardcoded `required: "true"` as string (boolean only)
- ❌ Direct `field.name = ${parent}.${name}` mutation — use immutable spread in resolvers

## Spec & plan

- Design: `docs/superpowers/specs/2026-04-19-rdf-modernization-design.md`
- Plan: `docs/superpowers/plans/2026-04-19-rdf-v1-foundation.md`
```

- [ ] **Step 2: `settings.json`**

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(pnpm:*)",
      "Bash(git status)",
      "Bash(git log:*)",
      "Bash(git diff:*)",
      "Bash(git branch:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git checkout:*)",
      "Bash(git push:*)",
      "Bash(gh pr:*)",
      "Bash(gh issue:*)",
      "Bash(npx:*)"
    ],
    "deny": [
      "Bash(rm -rf /:*)",
      "Bash(git push --force:*)",
      "Bash(git reset --hard:*)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "pnpm -w turbo typecheck --filter=...[HEAD~1] 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 3: `commands/release.md`**

```markdown
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
- Use `prerelease` mode (`pnpm changeset pre enter next`) for v1-beta style tags.
```

- [ ] **Step 4: `commands/new-field.md`**

```markdown
---
description: Scaffold a new field kind end-to-end
---

# /new-field

Add a new field kind to react-dynamic-forms.

Ask the user:
1. Field kind identifier (e.g., `color`, `file`, `combobox`) — kebab if multi-word.
2. What Zod/JSON Schema source maps to it? (e.g., `z.string().regex(/#[0-9a-f]{6}/)` for color, `{ format: 'color' }` for JSON Schema).
3. What primitive UI component does it render? (Use existing or add to `packages/ui/src/primitives/`.)

## Steps

1. Update `packages/core/src/internal-schema.ts`:
   - Add to `FieldKind` union.
   - Add/extend a `...FieldSpec` type with kind-specific props (e.g., `defaultColor`).
2. Update adapters with detection tests first (TDD):
   - `adapters/zod.test.ts` — add test for Zod→new kind.
   - `adapters/json-schema.test.ts` — add test for JSON Schema→new kind.
   - `adapters/legacy.test.ts` — if legacy has a mapping, add test.
3. Make the tests pass.
4. Update `schema-to-zod.ts` to produce a Zod validator from the new spec.
5. Create `packages/ui/src/fields/<kind>-field.tsx`.
6. Add case to `packages/ui/src/fields/field-resolver.tsx`.
7. Add the field to `apps/demo/src/examples/zod-example.ts` for live preview.
8. `pnpm test` — all green.
9. `pnpm changeset` — minor bump.
10. Commit.
```

- [ ] **Step 5: `commands/new-example.md`**

```markdown
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
```

- [ ] **Step 6: `commands/schema-adapter.md`**

```markdown
---
description: Add a new schema format adapter (OpenAPI, Prisma, TypeBox, etc.)
---

# /schema-adapter

Plug a new input format into the adapter pipeline.

Ask: what's the format, and what's a representative input? Fetch 2–3 examples from docs if needed.

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
```

- [ ] **Step 7: `agents/form-field-builder.md`**

```markdown
---
name: form-field-builder
description: Scaffold a new FieldKind end-to-end across core adapters + ui component + tests + demo.
---

You are a specialized subagent for adding new field kinds to `@rogeroliveira84/react-dynamic-forms`.

## Context

- Canonical type: `InternalSchema` in `packages/core/src/internal-schema.ts`
- Adapters live in `packages/core/src/adapters/`
- UI components in `packages/ui/src/fields/`
- Resolver switch in `packages/ui/src/fields/field-resolver.tsx`
- Demo examples in `apps/demo/src/examples/`

## Process

Follow the `/new-field` command checklist exactly. For each step, TDD — write the failing test first, then implement. After all field kinds your task covers are complete, run `pnpm test` and `pnpm build` in every touched package. Do not skip the changeset or the demo example.

## Quality bar

- `noUncheckedIndexedAccess` must pass.
- All three adapters (Zod, JSON Schema, legacy if applicable) must map to your new kind with tests.
- The demo app must visually render the new kind without Tailwind styling breakage.
- WCAG AA: keyboard-navigable, labeled, error-announced.
```

- [ ] **Step 8: `agents/docs-writer.md`**

```markdown
---
name: docs-writer
description: Keep docs (README, migration guide, docs site) in sync with lib changes.
---

You are a specialized subagent for maintaining all user-facing documentation.

## Scope

- `README.md` (English, marketing-first)
- `README.pt-br.md` (Portuguese mirror)
- `docs/migrate-from-v0.md`
- `apps/docs/` (Next.js site — v1 is a stub, fleshed out in v2)
- Field-by-field API reference in `packages/core/README.md`

## Tone

English: confident, friendly, visual. Emojis per section heading only.
Portuguese: slightly more casual, same information.

## Process

1. Read the diff (`git log -p HEAD~N`) for the changes you're documenting.
2. Update the "Supported fields" / "Supported schema inputs" tables if they apply.
3. Update code examples in README if the public API changed — they must actually compile.
4. If the change is a breaking one, add a section to `migrate-from-v0.md`.
5. Keep the Portuguese README in lockstep (same sections, translated).
6. Commit with `docs: <what>`.

## Forbidden

- No placeholders like "TBD" in user-facing docs.
- No emojis mid-sentence (only section headings).
- No `any` in documented TypeScript examples.
```

- [ ] **Step 9: Commit**

```bash
git add .claude
git commit -m "chore(claude): add .claude/ folder with CLAUDE.md, commands, subagents, settings"
```

---

## Task 23: Migration guide

**Files:**
- Create: `docs/migrate-from-v0.md`

- [ ] **Step 1: Write the guide**

```markdown
# Migrating from v0.5.x to v1.0.0

v1.0.0 is a near-complete rewrite, but we kept the legacy `config` prop working for one major version to smooth the transition. Plan a migration within the v1 lifecycle — the legacy adapter will be removed in v2.

## TL;DR

1. Rename `config` prop to `schema`.
2. Replace `@rogeroliveira84/react-dynamic-forms` default-import with a named import of `{ DynamicForm }` from `@rogeroliveira84/react-dynamic-forms-ui`.
3. Install peer deps: `react-hook-form`, `zod`, `@rogeroliveira84/react-dynamic-forms-ui`.
4. Import the UI stylesheet: `import '@rogeroliveira84/react-dynamic-forms-ui/styles.css'`.
5. Optionally, port your JSON config to a Zod schema for type safety and better DX.

## Import changes

### v0.5
```js
import DynamicForm from '@rogeroliveira84/react-dynamic-forms'
```

### v1
```ts
import { DynamicForm } from '@rogeroliveira84/react-dynamic-forms-ui'
import '@rogeroliveira84/react-dynamic-forms-ui/styles.css'
```

## Prop changes

### Legacy (still works with warning)
```jsx
<DynamicForm config={legacyJson} onSubmit={fn} />
```

### v1 preferred
```tsx
<DynamicForm schema={legacyJson} onSubmit={fn} />
```

The legacy config object is still accepted. A `console.warn` fires in dev. Recommended: port to Zod.

## Porting a legacy config to Zod

### Before
```json
{
  "name": "Client Register",
  "fields": [
    { "id": "fullname", "label": "Full Name", "type": "text", "required": "true", "value": "", "placeholder": "..." },
    { "id": "dateOfBirth", "label": "Date Of Birth", "type": "date", "required": "false", "value": "" },
    { "id": "age", "label": "Age", "type": "number", "required": "false", "value": "", "definition": { "min": "0", "max": "100", "step": "1" } }
  ]
}
```

### After
```ts
import { z } from 'zod'

const schema = z.object({
  fullname: z.string().describe('Full Name'),
  dateOfBirth: z.coerce.date().optional().describe('Date Of Birth'),
  age: z.number().min(0).max(100).optional().describe('Age'),
})
```

## Field type mapping

| v0.5 type        | v1 kind        | Zod example                         | JSON Schema example                            |
|------------------|----------------|-------------------------------------|------------------------------------------------|
| `text`           | `text`         | `z.string()`                        | `{ type: 'string' }`                           |
| `date`           | `date`         | `z.coerce.date()`                   | `{ type: 'string', format: 'date' }`           |
| `datetime-local` | `datetime`     | `z.coerce.date()`                   | `{ type: 'string', format: 'date-time' }`     |
| `time`           | `time`         | `z.string()` with regex or format   | `{ type: 'string', format: 'time' }`          |
| `number`         | `number`       | `z.number().min().max()`            | `{ type: 'number', minimum, maximum }`         |
| `checkbox`       | `boolean`      | `z.boolean()`                       | `{ type: 'boolean' }`                          |
| `array`          | `enum`         | `z.enum([...])`                     | `{ type: 'string', enum: [...] }`              |
| `multi-array`    | `multi-enum`   | `z.array(z.enum([...]))`            | `{ type: 'array', items: { enum: [...] } }`   |

## Output format

### v0.5
```json
{ "timeStamp": 1551747768847, "data": [{ "name": "fullname", "value": "..." }] }
```

### v1
```json
{ "fullname": "...", "dateOfBirth": "1980-01-01", "age": 30 }
```

v1 returns a plain object keyed by field names. Timestamp is gone (trivially added in your `onSubmit`). If you need the array shape, transform in your submit handler.

## Breaking changes summary

- `config` prop deprecated → use `schema`
- Default export → named export from `@rogeroliveira84/react-dynamic-forms-ui`
- Output shape is now a flat object, not `{ timeStamp, data: [{ name, value }] }`
- Bootstrap styling removed → shadcn/Tailwind (can be themed via CSS variables)
- Dependencies changed: `zod` and `react-hook-form` are now peer deps

## Questions?

Open an issue: https://github.com/rogeroliveira84/react-dynamic-forms/issues
```

- [ ] **Step 2: Commit**

```bash
git add docs/migrate-from-v0.md
git commit -m "docs: add v0.5 → v1 migration guide"
```

---

## Task 24: Marketing README (English + Portuguese)

**Files:**
- Modify: `README.md`
- Create: `README.pt-br.md`

- [ ] **Step 1: Replace root `README.md`**

```markdown
<div align="center">

# 🎛️ React Dynamic Forms

### Zod-powered dynamic React forms. Type-safe. AI-ready.

[![npm version](https://img.shields.io/npm/v/@rogeroliveira84/react-dynamic-forms?color=blue&label=npm)](https://www.npmjs.com/package/@rogeroliveira84/react-dynamic-forms)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@rogeroliveira84/react-dynamic-forms?label=gzipped)](https://bundlephobia.com/package/@rogeroliveira84/react-dynamic-forms)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/rogeroliveira84/react-dynamic-forms?style=social)](https://github.com/rogeroliveira84/react-dynamic-forms)

🇧🇷 [Leia em Português](./README.pt-br.md)

</div>

---

## ✨ One schema. One form. Zero boilerplate.

```tsx
import { DynamicForm } from '@rogeroliveira84/react-dynamic-forms-ui'
import '@rogeroliveira84/react-dynamic-forms-ui/styles.css'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18).max(120),
  newsletter: z.boolean().default(false),
  country: z.enum(['BR', 'US', 'PT']),
})

export function SignupForm() {
  return <DynamicForm schema={schema} onSubmit={(data) => console.log(data)} />
}
```

## 🚀 Why?

- ⚡ **One-liner** — pass a schema, get a production-ready form.
- 🧠 **Type-safe end-to-end** — full TypeScript inference from schema to submit.
- 🪶 **Tiny** — < 15 kb gzipped core, tree-shakable, headless-friendly.
- 🎨 **Beautiful** — shadcn/ui out of the box, fully themeable via CSS variables.
- ♿ **Accessible** — WCAG AA, keyboard-first, ARIA-correct, dark-mode ready.
- 🔀 **Hybrid input** — accepts **Zod schemas**, **JSON Schema Draft 2020-12**, or **legacy v0.5 config**.
- 🤖 **AI-ready** *(v2)* — prompt → schema → form in seconds.

## 📦 Install

```bash
pnpm add @rogeroliveira84/react-dynamic-forms @rogeroliveira84/react-dynamic-forms-ui react-hook-form zod
```

## 🧩 Supported schema inputs

| Input | Example | Status |
|---|---|---|
| **Zod** | `z.object({ ... })` | ✅ v1 |
| **JSON Schema Draft 2020-12** | `{ type: 'object', properties: { ... } }` | ✅ v1 |
| **Legacy v0.5 config** | `{ fields: [{ id, label, type, ... }] }` | ⚠️ deprecated, removed in v2 |
| **AI prompt → schema** | `generateSchema({ prompt: "..." })` | 🔜 v2 |

## 🧱 Supported field kinds

`text` · `email` · `password` · `url` · `number` · `slider` · `textarea` · `boolean` · `date` · `datetime` · `time` · `enum` · `multi-enum` · `object` *(nested)* · `array` *(repeater)*

Coming in v2: `combobox` *(async)*, `file`, `richtext`, `conditional`, `multi-step wizard`.

## 🎨 Styling & theming

shadcn/ui under the hood. Override the default theme with CSS variables:

```css
:root {
  --rdf-primary: 340 82% 52%;      /* pink */
  --rdf-radius: 0.75rem;
}
```

Or pass custom components via the `components` prop (coming soon).

## 🧭 Comparison

| Feature                            | RDF     | RJSF | JSON Forms | react-hook-form |
|-----------------------------------|---------|------|------------|-----------------|
| Zod schema input                   | ✅      | ❌   | ❌         | ✅              |
| JSON Schema input                  | ✅      | ✅   | ✅         | ❌              |
| shadcn/ui out of the box           | ✅      | ❌   | ❌         | ❌              |
| TypeScript inference of form data  | ✅      | ⚠️  | ⚠️         | ✅              |
| Bundle size (gzip, core)           | < 15 kb | ~60 kb | ~80 kb   | ~9 kb           |
| AI-powered generation (planned)    | ✅ v2   | ❌   | ❌         | ❌              |

*Numbers are approximations from Bundlephobia. Not a trash-talk — all these libs are great.*

## 📚 Docs

- [Live playground](https://rdf.dev) *(coming soon)*
- [Migration from v0.5](./docs/migrate-from-v0.md)
- [Design spec](./docs/superpowers/specs/2026-04-19-rdf-modernization-design.md)

## 🗺️ Roadmap

- [x] **v1.0** — Foundation (Zod + JSON Schema + shadcn + RHF)
- [ ] **v1.1** — `file`, `combobox`, `conditional`
- [ ] **v2.0** — AI generator (`prompt → schema`), multi-step wizard, i18n
- [ ] **v3.0** — Visual form builder *(maybe)*

## 🤝 Contributing

PRs welcome. See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

Quick start:
```bash
git clone https://github.com/rogeroliveira84/react-dynamic-forms
cd react-dynamic-forms
pnpm install
pnpm dev
```

## 📜 License

MIT © Roger Oliveira
```

- [ ] **Step 2: `README.pt-br.md`**

```markdown
<div align="center">

# 🎛️ React Dynamic Forms

### Formulários React dinâmicos com Zod. Type-safe. Prontos pra IA.

[![npm](https://img.shields.io/npm/v/@rogeroliveira84/react-dynamic-forms?color=blue&label=npm)](https://www.npmjs.com/package/@rogeroliveira84/react-dynamic-forms)
[![tamanho](https://img.shields.io/bundlephobia/minzip/@rogeroliveira84/react-dynamic-forms?label=gzipped)](https://bundlephobia.com/package/@rogeroliveira84/react-dynamic-forms)
[![licença](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

🇺🇸 [Read in English](./README.md)

</div>

---

## ✨ Um schema. Um form. Zero boilerplate.

```tsx
import { DynamicForm } from '@rogeroliveira84/react-dynamic-forms-ui'
import '@rogeroliveira84/react-dynamic-forms-ui/styles.css'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  idade: z.number().min(18).max(120),
  newsletter: z.boolean().default(false),
  pais: z.enum(['BR', 'US', 'PT']),
})

export function CadastroForm() {
  return <DynamicForm schema={schema} onSubmit={(data) => console.log(data)} />
}
```

## 🚀 Por quê?

- ⚡ **Uma linha** — você passa o schema, recebe um form pronto.
- 🧠 **Type-safe de ponta a ponta** — inferência TS do schema até o submit.
- 🪶 **Pequeno** — menos de 15 kb gzipped no core, tree-shakable.
- 🎨 **Bonito** — shadcn/ui por padrão, tema via CSS variables.
- ♿ **Acessível** — WCAG AA, teclado, ARIA, dark mode.
- 🔀 **Múltiplos formatos de entrada** — Zod, JSON Schema 2020-12, config legado v0.5.
- 🤖 **Pronto pra IA** *(v2)* — prompt → schema → form em segundos.

## 📦 Instalação

```bash
pnpm add @rogeroliveira84/react-dynamic-forms @rogeroliveira84/react-dynamic-forms-ui react-hook-form zod
```

## 📚 Documentação

- [Playground ao vivo](https://rdf.dev) *(em breve)*
- [Migração da v0.5](./docs/migrate-from-v0.md)

## 🤝 Contribuição

PRs bem-vindos. Veja [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## 📜 Licença

MIT © Roger Oliveira
```

- [ ] **Step 3: Commit**

```bash
git add README.md README.pt-br.md
git commit -m "docs: marketing-first README (English + Portuguese)"
```

---

## Task 25: Final setup — ESLint, Prettier, editorconfig

**Files:**
- Delete: `.eslintrc` (legacy)
- Create: `eslint.config.js` (flat config, minimal)
- Create: `.prettierrc.json`
- Create: `.editorconfig`
- Create: `.prettierignore`

- [ ] **Step 1: Delete legacy `.eslintrc`**

```bash
rm -f .eslintrc
```

- [ ] **Step 2: Flat config ESLint**

```js
// eslint.config.js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/**', 'node_modules/**', '.next/**', 'coverage/**', '**/*.cjs'],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
)
```

- [ ] **Step 3: Prettier**

```json
// .prettierrc.json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 120,
  "tabWidth": 2
}
```

```
# .prettierignore
node_modules
dist
.next
coverage
pnpm-lock.yaml
*.md
```

- [ ] **Step 4: Editorconfig**

```ini
# .editorconfig
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
charset = utf-8

[*.md]
trim_trailing_whitespace = false
```

- [ ] **Step 5: Add eslint/ts-eslint to root devDeps**

Update root `package.json` `devDependencies`:
```json
{
  "@eslint/js": "^9.15.0",
  "eslint": "^9.15.0",
  "typescript-eslint": "^8.15.0"
}
```

Then `pnpm install`.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: add ESLint flat config + Prettier + editorconfig"
```

---

## Task 26: Verification — full build & test pass

- [ ] **Step 1: Clean install**

```bash
pnpm install
```
Expected: success.

- [ ] **Step 2: Typecheck all**

```bash
pnpm typecheck
```
Expected: 0 errors.

- [ ] **Step 3: Test all**

```bash
pnpm test
```
Expected: all tests pass.

- [ ] **Step 4: Build all**

```bash
pnpm build
```
Expected: all packages build, `dist/` folders created.

- [ ] **Step 5: If any step fails, fix before proceeding. Do NOT ignore or `--no-verify`.**

---

## Task 27: Push branch and open PR

- [ ] **Step 1: Push branch**

```bash
git push -u origin feat/v1-foundation-rebirth
```

- [ ] **Step 2: Open PR**

```bash
gh pr create --title "feat: v1 foundation — monorepo + Zod-first rebirth" --body "$(cat <<'EOF'
## Summary

Complete rebirth of `react-dynamic-forms` as a modern pnpm/Turborepo monorepo shipping a Zod-first dynamic form library with shadcn/ui.

### What's in
- **Monorepo** with pnpm + Turborepo: `packages/core`, `packages/ui`, `packages/ai` (placeholder), `apps/demo`, `apps/docs` (stub).
- **`@rogeroliveira84/react-dynamic-forms`** (core) — schema adapters for **Zod**, **JSON Schema Draft 2020-12**, and **legacy v0.5 config** → canonical `InternalSchema` → `useDynamicForm` hook wired to `react-hook-form` + `@hookform/resolvers/zod`.
- **`@rogeroliveira84/react-dynamic-forms-ui`** — shadcn-based field components (Input, Select, Checkbox, Switch, Slider, RadioGroup, Textarea, Label, Button) + field components per kind (text/email/password/url/number/slider/textarea/boolean/date/datetime/time/enum/multi-enum/object/array) + `<DynamicForm>` orchestrator.
- **Vite demo** showing all three schema inputs side-by-side.
- **React 19 + TypeScript strict** throughout.
- **Tests** — Vitest + React Testing Library, smoke coverage across adapters and main form.
- **GitHub Actions CI** (Node 20 + 22 matrix) replacing CircleCI + Travis.
- **Changesets** for release flow.
- **`.claude/` folder** — CLAUDE.md, settings, commands (`/release`, `/new-field`, `/new-example`, `/schema-adapter`), subagents (`form-field-builder`, `docs-writer`).
- **Marketing-first README** (English + Portuguese) with badges, comparison table, roadmap.
- **Migration guide** from v0.5 at `docs/migrate-from-v0.md`.
- Legacy `config` prop kept with deprecation warning for one major version.

### What's out (intentional — v2 or later)
- AI schema generator (`packages/ai` is a placeholder; real implementation in v2).
- Fleshed-out Next.js docs site (stub for now).
- Conditional fields, multi-step wizard, file upload, combobox, rich text.
- Visual form builder.

### Design & plan
- Spec: `docs/superpowers/specs/2026-04-19-rdf-modernization-design.md`
- Implementation plan: `docs/superpowers/plans/2026-04-19-rdf-v1-foundation.md`

## Test plan

- [ ] `pnpm install` succeeds locally
- [ ] `pnpm typecheck` — zero errors
- [ ] `pnpm test` — all tests pass (core adapters + UI smoke)
- [ ] `pnpm build` — all packages emit `dist/`
- [ ] `pnpm --filter demo dev` — demo renders all three schema examples
- [ ] Submit a Zod example, verify console output is a plain object
- [ ] Submit a JSON Schema example, same expectation
- [ ] Submit a legacy example, verify deprecation warning in console
- [ ] Toggle dark mode (via adding `class="dark"` to `<html>`) — verify contrast
- [ ] Check bundle size on `packages/core/dist/index.js` — target < 15 kb gzipped
- [ ] CI matrix (Node 20 + 22) passes in Actions

## Breaking changes
- `config` prop → `schema` (legacy still works with warning for v1)
- Output shape is now a plain object instead of `{ timeStamp, data: [{ name, value }] }`
- Default export → named `{ DynamicForm }` from `@rogeroliveira84/react-dynamic-forms-ui`
- Bootstrap removed → shadcn (themeable via CSS variables)

Ships as v1.0.0 via the linked Changeset.
EOF
)"
```

- [ ] **Step 3: Return PR URL to user**

---

## Self-Review

### Spec coverage check
- §3 Monorepo — Tasks 3, 4, 12, 17, 18 ✅
- §4 Public API — Tasks 10, 15 ✅
- §5 Internal architecture (pipeline) — Tasks 5–11 ✅
- §6 Field types v1 — Tasks 14, 15 (all 15 kinds covered by FieldResolver) ✅
- §7 Validation & errors — Task 10 (resolver) + Task 14 (error rendering) ✅
- §8 Testing — Tasks 6–10, 16 ✅
- §9 CI/CD + publishing — Tasks 20, 21 ✅
- §10 README marketing — Task 24 ✅
- §11 `.claude/` folder — Task 22 ✅
- §12 Migration — Tasks 8, 15 (legacy prop), 23 (guide) ✅
- §13 Phase 2 preview — Task 17 (placeholder) ✅
- §15 Timeline — implicit; tasks are sized for <1 day each except Tasks 13/14 which are multi-step

### Placeholder scan
- No "TBD", "TODO", or "implement later" in code/copy steps.
- §17 of spec listed "open questions" — these are acknowledged, not punted: Tailwind 3 is chosen for v1, Fumadocs deferred to v2 docs site push, Vercel AI Gateway deferred to v2.

### Type consistency
- `FieldKind` union → matches `FieldSpec` discriminated types → matches `field-resolver.tsx` switch.
- `SchemaInput` type used consistently in `detect`, `useDynamicForm`, `DynamicForm`.
- `EnumOption` used in adapters (Zod, JSON Schema, legacy) and consumed identically in `EnumField`/`MultiEnumField`.
- `@rogeroliveira84/react-dynamic-forms-ui` package name matches across `ui/package.json`, `demo/package.json`, README.

### Known simplifications (documented)
- `multi-enum` is rendered as a checkbox list, not a combobox. Combobox deferred to v1.1.
- `MultiEnumField` input stores values as their raw primitive type (string/number), matching adapter options.
- `time` kind's Zod resolver uses `z.string()` since HTML `<input type="time">` returns a string — callers wanting `Date` should compose themselves.
- `ArrayField` appends empty string `''` by default — works for text/email/password/url; nested repeaters require users to set a default via `defaultValues`.
- `packages/ai` is a documented placeholder with zero runtime code; published as private.

### Forbidden patterns (reaffirmed, matches `CLAUDE.md`)
- No `any` in public APIs (only internally in a few unwrapping paths where Zod's `_def` types would be unwieldy).
- No default exports.
- No CRA, no Enzyme, no PropTypes, no `ReactDOM.render`.
- No `required: "true"` as string in InternalSchema.
