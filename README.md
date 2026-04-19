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

## 🚀 Why RDF?

- ⚡ **One-liner** — pass a schema, get a production-ready form.
- 🧠 **Type-safe end-to-end** — full TypeScript inference from schema to submit.
- 🪶 **Tiny** — sub-15 kb gzipped core, tree-shakable, headless-friendly.
- 🎨 **Beautiful** — shadcn/ui out of the box, fully themeable via CSS variables.
- ♿ **Accessible** — WCAG AA, keyboard-first, ARIA-correct, dark-mode ready.
- 🔀 **Hybrid input** — accepts **Zod schemas**, **JSON Schema Draft 2020-12**, or **legacy v0.5 config**.
- 🤖 **AI-powered** — `generateSchema({ prompt, model })` turns plain English into a validated Zod schema in one call.

## 📦 Install

```bash
pnpm add @rogeroliveira84/react-dynamic-forms @rogeroliveira84/react-dynamic-forms-ui react-hook-form zod
```

## 🧩 Supported schema inputs

| Input                              | Example                                           | Status          |
|------------------------------------|---------------------------------------------------|-----------------|
| **Zod**                            | `z.object({ ... })`                               | ✅ v1           |
| **JSON Schema Draft 2020-12**      | `{ type: 'object', properties: { ... } }`         | ✅ v1           |
| **Legacy v0.5 config**             | `{ fields: [{ id, label, type, ... }] }`          | ⚠️ deprecated  |
| **AI prompt → schema**             | `generateSchema({ prompt: '...' })`                | 🔜 v2           |

## 🧱 Supported field kinds

`text` · `email` · `password` · `url` · `number` · `slider` · `textarea` · `boolean` · `date` · `datetime` · `time` · `enum` · `multi-enum` · `object` *(nested)* · `array` *(repeater)* · `file` · plus `showIf` conditional fields on any kind.

Coming next: `combobox` *(async)*, `richtext`, `multi-step wizard`, i18n.

## 🤖 AI schema generation

```tsx
import { generateSchema } from '@rogeroliveira84/react-dynamic-forms-ai'
import { DynamicForm } from '@rogeroliveira84/react-dynamic-forms-ui'
import { anthropic } from '@ai-sdk/anthropic'

const { internalSchema, zodCode } = await generateSchema({
  from: 'text',
  prompt: 'A job application form for software engineers with portfolio and years of experience',
  model: anthropic('claude-sonnet-4-6'),
})

<DynamicForm schema={internalSchema} onSubmit={(data) => console.log(data)} />
```

Server-side only — never expose API keys to the browser. Works with any `@ai-sdk/*` provider (Anthropic, OpenAI, Google, Mistral, Groq, etc.).

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

| Feature                            | RDF v1     | RJSF | JSON Forms | react-hook-form |
|------------------------------------|------------|------|------------|-----------------|
| Zod schema input                   | ✅         | ❌   | ❌         | ✅              |
| JSON Schema input                  | ✅         | ✅   | ✅         | ❌              |
| shadcn/ui out of the box           | ✅         | ❌   | ❌         | ❌              |
| TypeScript inference of form data  | ✅         | ⚠️   | ⚠️         | ✅              |
| Bundle size (gzip, core)           | < 15 kb    | ~60 kb | ~80 kb   | ~9 kb           |
| AI-powered generation (planned)    | ✅ v2      | ❌   | ❌         | ❌              |

*Bundle numbers are approximations from Bundlephobia. All these libs are great — this table is about fit.*

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
