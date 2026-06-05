<div align="center">

# 🎛️ React Dynamic Forms

### Formulários React dinâmicos com Zod. Type-safe. Pequenos.

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
- 🧙 **Wizard multi-etapa** — divida qualquer schema em etapas validadas com um componente.
- 🔎 **Combobox assíncrono** — selects com busca alimentados por dados remotos.
- 🌍 **i18n** — traduza todas as mensagens de validação com uma única prop `locale`.

## 📦 Instalação

```bash
pnpm add @rogeroliveira84/react-dynamic-forms @rogeroliveira84/react-dynamic-forms-ui react-hook-form zod
```

## 🧩 Entradas suportadas

| Entrada                            | Exemplo                                           | Status          |
|------------------------------------|---------------------------------------------------|-----------------|
| **Zod**                            | `z.object({ ... })`                               | ✅              |
| **JSON Schema Draft 2020-12**      | `{ type: 'object', properties: { ... } }`         | ✅              |
| **Config legado v0.5**             | `{ fields: [{ id, label, type, ... }] }`          | ⚠️ obsoleto    |

## 🧱 Tipos de campo suportados

`text` · `email` · `password` · `url` · `number` · `slider` · `textarea` · `boolean` · `date` · `datetime` · `time` · `enum` · `multi-enum` · `combobox` *(estático ou async)* · `object` *(aninhado)* · `array` *(lista repetida)* · `file` · mais campos condicionais `showIf` em qualquer tipo.

## 🧙 Wizard multi-etapa

Divida um único schema em etapas validadas. Um form por baixo — os valores persistem ao navegar, e o **Próximo** não avança enquanto a etapa atual estiver inválida.

```tsx
<DynamicForm.Wizard
  schema={schema}
  steps={[
    { title: 'Conta', fields: ['email', 'senha'] },
    { title: 'Perfil', fields: ['nome', 'idade'] },
  ]}
  onSubmit={(data) => console.log(data)}
/>
```

## 🔎 Combobox com opções assíncronas

Qualquer campo com um loader assíncrono vira um combobox com busca, debounce e navegação por teclado — até um simples `z.string()`.

```tsx
<DynamicForm
  schema={z.object({ cidade: z.string() })}
  asyncOptions={{ cidade: (busca) => buscarCidades(busca) }}
/>
```

Para listas estáticas, declare um combobox no JSON Schema com a extensão `x-rdf-combobox`.

## 🌍 Validação internacionalizada

Uma prop traduz todas as mensagens de validação. Pacotes embutidos `en`, `pt-BR` e `es`; sobrescreva mensagens específicas com `messages`, ou passe seu próprio objeto de mensagens. Mensagens definidas direto no schema sempre vencem.

```tsx
<DynamicForm schema={schema} locale="pt-BR" />
```

## 📚 Documentação

- [Migração da v0.5](./docs/migrate-from-v0.md)
- [Design spec (EN)](./docs/superpowers/specs/2026-04-19-rdf-modernization-design.md)

## 🗺️ Roadmap

- [x] **Fundação** — Zod + JSON Schema + shadcn + RHF
- [x] **Upload de arquivo + campos condicionais** (`showIf`)
- [x] **Wizard multi-etapa · combobox assíncrono · i18n**
- [ ] **Combobox multi-seleção · rich text**
- [ ] **Construtor visual de formulários** *(talvez)*

## 🤝 Contribuição

PRs bem-vindos. Veja [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## 📜 Licença

MIT © Roger Oliveira
