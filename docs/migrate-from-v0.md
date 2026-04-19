# Migrating from v0.5.x to v1.0.0

v1.0.0 is a near-complete rewrite, but we kept the legacy `config` prop working for one major version to smooth the transition. Plan your migration within the v1 lifecycle — the legacy adapter is removed in v2.

## TL;DR

1. Rename the `config` prop to `schema`.
2. Replace the default-import with a named import of `{ DynamicForm }` from `@rogeroliveira84/react-dynamic-forms-ui`.
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

### Legacy (still works with a console warning)
```jsx
<DynamicForm config={legacyJson} onSubmit={fn} />
```

### v1 preferred
```tsx
<DynamicForm schema={legacyJson} onSubmit={fn} />
```

The legacy config object is still accepted. A `console.warn` fires in development. Recommended: port to Zod.

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

| v0.5 type        | v1 kind      | Zod example                         | JSON Schema example                            |
|------------------|--------------|-------------------------------------|------------------------------------------------|
| `text`           | `text`       | `z.string()`                        | `{ type: 'string' }`                           |
| `date`           | `date`       | `z.coerce.date()`                   | `{ type: 'string', format: 'date' }`           |
| `datetime-local` | `datetime`   | `z.coerce.date()`                   | `{ type: 'string', format: 'date-time' }`      |
| `time`           | `time`       | `z.string()`                        | `{ type: 'string', format: 'time' }`           |
| `number`         | `number`     | `z.number().min().max()`            | `{ type: 'number', minimum, maximum }`         |
| `checkbox`       | `boolean`    | `z.boolean()`                       | `{ type: 'boolean' }`                          |
| `array`          | `enum`       | `z.enum([...])`                     | `{ type: 'string', enum: [...] }`              |
| `multi-array`    | `multi-enum` | `z.array(z.enum([...]))`            | `{ type: 'array', items: { enum: [...] } }`   |

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
- Output shape is now a flat object
- Bootstrap styling removed → shadcn/Tailwind (themeable via CSS variables)
- `zod` and `react-hook-form` are now peer deps you install yourself

## Questions?

Open an issue: https://github.com/rogeroliveira84/react-dynamic-forms/issues
