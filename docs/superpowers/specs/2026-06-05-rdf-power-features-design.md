# React Dynamic Forms — Power Features (Wizard · Combobox · i18n)

**Status:** Draft v1
**Date:** 2026-06-05
**Author:** Roger Oliveira
**Target audience:** contributors, future maintainers, AI coding agents

---

## 1. Goal

Add the three remaining roadmap features to `@rogeroliveira84/react-dynamic-forms` in a single, focused release:

1. **Multi-step wizard** — `DynamicForm.Wizard` for forms split into validated steps.
2. **Combobox** — searchable single-select with optional **async** options.
3. **i18n** — localized validation messages via one `locale` prop.

**Non-negotiable design constraints** (these are acceptance criteria, not vibes):

- **Small.** No heavy dependencies. Wizard adds 0 deps; i18n adds 0 deps; combobox adds exactly one small dep (`@radix-ui/react-popover`). Everything opt-in and tree-shakable.
- **Fast.** No runtime cost for users who don't use a feature.
- **Functional & obvious.** The common case needs zero config. APIs are named so an LLM asked to "build a React form" would reach for them by default.
- **Backward compatible.** All three are purely additive. No breaking changes to existing schema inputs, `<DynamicForm>`, or `useDynamicForm`.

## 2. Architecture context (extension points)

The pipeline today:

```
schema (Zod | JSON Schema | legacy | InternalSchema)
  → detectAndConvert → InternalSchema { fields: FieldSpec[] }
  → useDynamicForm (core): builds zodSchema, RHF useForm + zodResolver
  → <DynamicForm> (ui): FormProvider → fields.map(FieldResolver)
  → FieldResolver: switch(kind) → <XField> using useFieldState + FieldWrapper
```

Each feature plugs into one of these seams:

| Feature | Seam |
|---|---|
| Wizard | New `ui` component reusing `useDynamicForm` + `FieldResolver`; slices fields by step. **No core change.** |
| Combobox | New `FieldKind` in core + adapter/zod-builder mappings + new `ui` field + `popover` primitive. |
| i18n | New `core/i18n` module producing a Zod `errorMap`, wired into `zodResolver`; `locale`/`messages` props on `useDynamicForm`/`DynamicForm`. |

A small shared piece of plumbing is introduced: **`RdfConfigContext`** (in `ui`) carrying render-time config that can't live in a static schema — currently just `asyncOptions`. `DynamicForm` and `DynamicForm.Wizard` provide it; fields consume it.

## 3. Feature 1 — Multi-step Wizard

### API

```tsx
<DynamicForm.Wizard
  schema={schema}
  steps={[
    { title: 'Account', fields: ['email', 'password'] },
    { title: 'Profile', description: 'Tell us about you', fields: ['name', 'age'] },
  ]}
  onSubmit={(data) => {}}
  onStepChange={(index) => {}}   // optional
  labels={{ next: 'Next', back: 'Back', submit: 'Finish' }}  // optional
/>
```

```ts
type WizardStep = { title?: string; description?: string; fields: string[] }
type FormWizardProps<TValues> = {
  schema: SchemaInput
  steps: WizardStep[]
  onSubmit: SubmitHandler<TValues>
  defaultValues?: DefaultValues<TValues>
  onStepChange?: (index: number) => void
  labels?: { next?: string; back?: string; submit?: string }
  // i18n + async options pass through to the underlying form:
  locale?: RdfLocaleInput
  messages?: RdfMessages
  asyncOptions?: AsyncOptionsMap
  className?: string
}
```

`DynamicForm.Wizard` is a static property on `DynamicForm` (`DynamicForm.Wizard = FormWizard`). The named export `FormWizard` is also available. No default exports.

### Behavior

- One underlying form (`useDynamicForm`) shared across steps — values persist when navigating.
- Renders only the current step's fields: filter `internalSchema.fields` by `name ∈ steps[current].fields`, render each through the existing `FieldResolver`.
- **Next** calls `await form.trigger(currentStepFieldNames)`; advances only if valid. **Back** never validates.
- Last step shows the submit button → `form.handleSubmit(onSubmit)` (validates the whole schema as a final guard).
- Progress indicator: "Step N of M" + a dot/segment per step.
- **DX guard:** in dev, `console.warn` if the union of all `steps[].fields` does not equal the schema's top-level field names (a field would otherwise silently block submit).

### Out of scope

Branching/conditional steps, per-step async submit, saving partial progress. (Conditional *fields* already exist via `showIf` and work inside steps.)

## 4. Feature 2 — Combobox (with async options)

### Core changes

- Add `'combobox'` to `FieldKind`.
- New spec:
  ```ts
  type ComboboxFieldSpec = BaseFieldSpec & {
    kind: 'combobox'
    options?: EnumOption[]   // static options; omitted when fed asynchronously
  }
  ```
- `schema-to-zod`: `combobox` with `options` → `z.union(literals)`; without options (async) → `z.string()`. Honor `required`/optional like other kinds.
- Adapters:
  - **JSON Schema**: a string property with extension `x-rdf-combobox: true` → `combobox`; `enum` (if present) becomes static `options`.
  - **InternalSchema passthrough**: already supported.
  - **Zod**: no native marker. Zod users opt in at render time via `asyncOptions` (below) — `z.string()` is the natural schema for a free-form/remote value.

### Render-time async upgrade (the killer-DX path)

```tsx
<DynamicForm
  schema={z.object({ city: z.string() })}
  asyncOptions={{ city: (query) => fetchCities(query) }}  // -> rendered as async combobox
/>
```

```ts
type AsyncOptionsMap = Record<string, (query: string) => Promise<EnumOption[]>>
```

- `DynamicForm`/`Wizard` accept `asyncOptions` and put it on `RdfConfigContext`.
- `FieldResolver` upgrade rule: if `asyncOptions[field.name]` exists, render `ComboboxField` regardless of the field's declared `kind`. This lets a plain `z.string()` become a searchable async combobox with no schema gymnastics.

### UI component (`ComboboxField`)

- New primitive `primitives/popover.tsx` wrapping `@radix-ui/react-popover` (the single new dependency).
- Composition: Popover trigger button (shows selected label or `placeholder`) + search `Input` + filtered option list.
- **Static options:** filter client-side by the query.
- **Async loader:** debounce input ~250ms, call `loadOptions(query)`, show a loading row, render results; cancel stale responses (ignore out-of-order results).
- Selecting calls `rhf.onChange(option.value)` and stores the chosen `label` locally for display (async values may have no label in the schema).
- **Keyboard & a11y:** ArrowUp/Down move the highlight, Enter selects, Escape closes; `role="listbox"`/`role="option"`, `aria-expanded`, `aria-activedescendant`, label wired through `FieldWrapper`.

### Out of scope

Multi-select combobox (`multi-combobox`), option grouping, create-on-the-fly. Multi-select is a clean follow-up but **not** in this release (YAGNI).

## 5. Feature 3 — i18n (localized validation messages)

### API

```tsx
<DynamicForm schema={schema} locale="pt-BR" />                  // localizes all messages
<DynamicForm schema={schema} messages={{ too_small_string: ({ min }) => `Mín ${min}` }} />  // fine-grained override
```

`locale` and `messages` are also accepted by `useDynamicForm` and `DynamicForm.Wizard`.

### Mechanism

- Zod produces validation messages. We localize **without touching the schema** by passing a localized `errorMap` into `zodResolver(schema, { errorMap })`.
- **Explicit schema messages win.** A message set in the schema (`z.string().email({ message: '...' })`) takes priority over the error map — by Zod's own precedence. So localization never clobbers intentional custom messages.

### Module shape (`packages/core/src/i18n/`)

- `messages.ts` — `type RdfMessages` = partial map of curated keys → `string | (params) => string`. Curated keys (the ones that actually matter for forms): `required`, `invalid_type`, `too_small_string`, `too_big_string`, `too_small_number`, `too_big_number`, `invalid_string_email`, `invalid_string_url`, `invalid_string_regex`, `invalid_enum_value`, `invalid_date`.
- `locales/en.ts`, `locales/pt-BR.ts`, `locales/es.ts` — each a full `RdfMessages`. Tiny objects.
- `error-map.ts` — `createErrorMap(messages: RdfMessages): ZodErrorMap` mapping each Zod issue to the localized string, falling back to `ctx.defaultError`.
- `resolve-messages.ts` — `resolveMessages(locale?, overrides?)` merges the chosen pack over `en`, then `overrides` on top.
- `type RdfLocaleInput = 'en' | 'pt-BR' | 'es' | RdfMessages` — accept a known locale string **or** a custom message object.

### Wiring

`useDynamicForm` builds the `errorMap` with `useMemo(locale, messages)` and passes `{ errorMap }` to `zodResolver`. Default (no `locale`) = English, identical to today's behavior (no regression).

### Out of scope

Translating field labels/descriptions (that's user content), RTL layout, locales beyond `en`/`pt-BR`/`es` (community can add packs later), async validation messages.

## 6. Shared plumbing — `RdfConfigContext`

A minimal React context in `ui`:

```ts
type RdfConfig = { asyncOptions?: AsyncOptionsMap }
```

`DynamicForm` and `DynamicForm.Wizard` wrap their fields in `<RdfConfigContext.Provider>`. `FieldResolver`/`ComboboxField` read it. Kept intentionally tiny — `locale`/`messages` do **not** go here (they're consumed in core at resolver-build time, not by fields).

## 7. Testing strategy (TDD, co-located)

- **core / i18n:** error map changes message by locale; override beats locale pack; explicit schema message beats both; unknown locale falls back to `en`.
- **core / combobox:** JSON Schema `x-rdf-combobox` → `combobox` kind; `schema-to-zod` builds union (static) and string (async); optional vs required.
- **ui / wizard:** renders only step 1; **Next blocked** while a step field is invalid; advances when valid; **Back** preserves values without validating; submit fires on the last step; dev warning when steps don't cover all fields.
- **ui / combobox:** opens on click; filters static options; async loader called (debounced) and results selectable; keyboard navigation (arrows/enter/escape); stale async response ignored.
- **ui / i18n integration:** `locale="pt-BR"` renders a Portuguese error in a real form submit.

Coverage: keep `core` ≥ 85% (CI gate). New `ui` components: happy path + error/empty + a11y of the combobox listbox.

## 8. Bundle & release

- **Bundle deltas:** wizard ≈ 0; i18n ≈ tiny (three small locale objects + a mapper); combobox = `@radix-ui/react-popover` + the field/primitive. All tree-shakable; unused features cost nothing.
- **Changeset:** one `minor` covering `@rogeroliveira84/react-dynamic-forms` + `@rogeroliveira84/react-dynamic-forms-ui` (they are `linked`).
- **Demo:** add one example per feature to `apps/demo` (wizard form, async-city combobox, `pt-BR` validation) so each is exercised end-to-end.

## 9. Implementation order (parallelizable)

The three features are independent and will be implemented in parallel, then integrated in a single PR:

- **Track A — i18n** (core only): `i18n/` module + `useDynamicForm` wiring + tests.
- **Track B — Combobox** (core + ui): `FieldKind`/spec/zod-builder/adapter + `popover` primitive + `ComboboxField` + `RdfConfigContext` + `asyncOptions` on `DynamicForm` + tests.
- **Track C — Wizard** (ui only): `FormWizard` + `DynamicForm.Wizard` + tests.

Integration touch-points to reconcile last: `DynamicForm` props gain `locale`/`messages` (A) and `asyncOptions` (B); `DynamicForm.Wizard` (C) forwards all three. `RdfConfigContext` (B) is provided by both `DynamicForm` and the wizard.

## 10. Out of scope (firmly)

- Multi-select combobox, option grouping, create-new-option.
- Branching wizard steps, per-step async submit, persisted progress.
- Label/description translation, RTL, extra locales, async validation.
- Any AI / schema-generation / hosting / deploy work — explicitly excluded.
