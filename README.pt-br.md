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

## 🧩 Entradas suportadas

| Entrada                            | Exemplo                                           | Status          |
|------------------------------------|---------------------------------------------------|-----------------|
| **Zod**                            | `z.object({ ... })`                               | ✅ v1           |
| **JSON Schema Draft 2020-12**      | `{ type: 'object', properties: { ... } }`         | ✅ v1           |
| **Config legado v0.5**             | `{ fields: [{ id, label, type, ... }] }`          | ⚠️ obsoleto    |
| **Prompt → schema (IA)**           | `generateSchema({ prompt: '...' })`                | 🔜 v2           |

## 🧱 Tipos de campo suportados

`text` · `email` · `password` · `url` · `number` · `slider` · `textarea` · `boolean` · `date` · `datetime` · `time` · `enum` · `multi-enum` · `object` *(aninhado)* · `array` *(lista repetida)*

Em breve (v2): `combobox` *(async)*, `file`, `richtext`, `condicional`, `wizard multi-etapa`.

## 📚 Documentação

- [Playground ao vivo](https://rdf.dev) *(em breve)*
- [Migração da v0.5](./docs/migrate-from-v0.md)

## 🤝 Contribuição

PRs bem-vindos. Veja [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## 📜 Licença

MIT © Roger Oliveira
