---
'@rogeroliveira84/react-dynamic-forms': minor
'@rogeroliveira84/react-dynamic-forms-ui': minor
---

# Power features — wizard, async combobox, i18n

## New

- **Multi-step wizard** — `<DynamicForm.Wizard steps={[...]}>` (also exported as `FormWizard`). One underlying form across steps; "Next" validates only the current step's fields via `form.trigger`, with a built-in progress indicator and a dev warning when steps don't cover all fields.
- **Combobox** — new `combobox` field kind: a searchable single-select. Supply async options at render with `<DynamicForm asyncOptions={{ field: (query) => Promise<EnumOption[]> }}>` and any field (even a plain `z.string()`) becomes a debounced, keyboard-navigable async combobox. Detected from JSON Schema via the `x-rdf-combobox` extension.
- **i18n** — localize all validation messages with a single `locale` prop (`'en' | 'pt-BR' | 'es'`, or a custom message object). Per-key overrides via `messages`. Messages set explicitly on the schema still win. Implemented as a Zod `errorMap`, so it works for Zod, JSON Schema, and legacy inputs alike.

## Changed

- `core` `FieldKind` union gained `combobox`; `JsonSchema` accepts `x-rdf-combobox`.
- `core` exports the i18n helpers (`createErrorMap`, `resolveMessages`, locale packs) and `RdfLocaleInput` / `RdfMessages` types.
- `ui` `<DynamicForm>` gained `locale`, `messages`, and `asyncOptions` props (all optional, fully backward compatible).

## Notes

- One new dependency in `ui`: `@radix-ui/react-popover` (powers the combobox). Wizard and i18n add no dependencies.
