<div align="center">

# 🎛️ React Dynamic Forms

### Zod-powered dynamic React forms. Type-safe. Tiny.

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

## 🚀 Why RDF?

- ⚡ **One-liner** — pass a schema, get a production-ready form.
- 🧠 **Type-safe end-to-end** — full TypeScript inference from schema to submit.
- 🪶 **Tiny** — sub-15 kb gzipped core, tree-shakable, headless-friendly.
- 🎨 **Beautiful** — shadcn/ui out of the box, fully themeable via CSS variables.
- ♿ **Accessible** — WCAG AA, keyboard-first, ARIA-correct, dark-mode ready.
- 🔀 **Hybrid input** — accepts **Zod schemas**, **JSON Schema Draft 2020-12**, or **legacy v0.5 config**.
- 🧙 **Multi-step wizard** — split any schema into validated steps with one component.
- 🔎 **Async combobox** — searchable selects backed by remote data, no extra wiring.
- 🌍 **i18n** — localize every validation message with a single `locale` prop.

## 📦 Install

```bash
pnpm add @rogeroliveira84/react-dynamic-forms @rogeroliveira84/react-dynamic-forms-ui react-hook-form zod
```

## 🧩 Supported schema inputs

| Input                              | Example                                           | Status          |
|------------------------------------|---------------------------------------------------|-----------------|
| **Zod**                            | `z.object({ ... })`                               | ✅              |
| **JSON Schema Draft 2020-12**      | `{ type: 'object', properties: { ... } }`         | ✅              |
| **Legacy v0.5 config**             | `{ fields: [{ id, label, type, ... }] }`          | ⚠️ deprecated  |

## 🧱 Supported field kinds

`text` · `email` · `password` · `url` · `number` · `slider` · `textarea` · `boolean` · `date` · `datetime` · `time` · `enum` · `multi-enum` · `combobox` *(static or async)* · `object` *(nested)* · `array` *(repeater)* · `file` · plus `showIf` conditional fields on any kind.

## 🧙 Multi-step wizard

Split a single schema into validated steps. One form underneath — values persist as you navigate, and **Next** won't advance while the current step is invalid.

```tsx
<DynamicForm.Wizard
  schema={schema}
  steps={[
    { title: 'Account', fields: ['email', 'password'] },
    { title: 'Profile', fields: ['name', 'age'] },
  ]}
  onSubmit={(data) => console.log(data)}
/>
```

## 🔎 Combobox with async options

Any field with an async loader becomes a searchable, debounced, keyboard-navigable combobox — even a plain `z.string()`.

```tsx
<DynamicForm
  schema={z.object({ city: z.string() })}
  asyncOptions={{ city: (query) => fetchCities(query) }}
/>
```

For static lists, declare a combobox in JSON Schema with the `x-rdf-combobox` extension.

## 🌍 Internationalized validation

One prop localizes every validation message. Built-in `en`, `pt-BR`, and `es`; override individual messages with `messages`, or pass your own message object. Messages set explicitly on the schema always win.

```tsx
<DynamicForm schema={schema} locale="pt-BR" />
```

## 🎨 Styling & theming

shadcn/ui under the hood. Override the default theme with CSS variables:

```css
:root {
  --rdf-primary: 340 82% 52%;      /* pink */
  --rdf-radius: 0.75rem;
}
```

The defaults ship in `@rogeroliveira84/react-dynamic-forms-ui/styles.css`. The `.dark` class toggles dark mode.

## 🧭 Comparison

| Feature                            | RDF        | RJSF | JSON Forms | react-hook-form |
|------------------------------------|------------|------|------------|-----------------|
| Zod schema input                   | ✅         | ❌   | ❌         | ✅              |
| JSON Schema input                  | ✅         | ✅   | ✅         | ❌              |
| shadcn/ui out of the box           | ✅         | ❌   | ❌         | ❌              |
| TypeScript inference of form data  | ✅         | ⚠️   | ⚠️         | ✅              |
| Multi-step wizard                  | ✅         | ❌   | ⚠️         | DIY             |
| Async combobox                     | ✅         | ⚠️   | ⚠️         | DIY             |
| Localized validation               | ✅         | ⚠️   | ✅         | DIY             |
| Bundle size (gzip, core)           | < 15 kb    | ~60 kb | ~80 kb   | ~9 kb           |

*Bundle numbers are approximations from Bundlephobia. All these libs are great — this table is about fit.*

## 📚 Docs

- [Migration from v0.5](./docs/migrate-from-v0.md)
- [Design spec](./docs/superpowers/specs/2026-04-19-rdf-modernization-design.md)
- [Power features spec](./docs/superpowers/specs/2026-06-05-rdf-power-features-design.md)

## 🗺️ Roadmap

- [x] **Foundation** — Zod + JSON Schema + shadcn + RHF
- [x] **File upload + conditional fields** (`showIf`)
- [x] **Multi-step wizard · async combobox · i18n**
- [ ] **Multi-select combobox · rich text**
- [ ] **Visual form builder** *(maybe)*

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
