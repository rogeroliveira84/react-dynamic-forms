import { useState, type ReactNode } from 'react'
import { DynamicForm } from '@rogeroliveira84/react-dynamic-forms-ui'
import { zodExample } from './examples/zod-example'
import { jsonSchemaExample } from './examples/json-schema-example'
import { legacyExample } from './examples/legacy-example'
import { wizardSchema, wizardSteps } from './examples/wizard-example'
import { comboboxSchema, loadCountries } from './examples/combobox-example'

type Submit = (data: unknown) => void
type TabDef = { label: string; blurb: string; render: (onSubmit: Submit) => ReactNode }

const tabs = {
  zod: {
    label: 'Zod',
    blurb: 'A Zod schema in, a validated form out.',
    render: (onSubmit) => <DynamicForm schema={zodExample} onSubmit={onSubmit} />,
  },
  json: {
    label: 'JSON Schema',
    blurb: 'JSON Schema Draft 2020-12 for backend interop.',
    render: (onSubmit) => <DynamicForm schema={jsonSchemaExample} onSubmit={onSubmit} />,
  },
  legacy: {
    label: 'Legacy v0.5',
    blurb: 'Old config format still works (with a deprecation warning).',
    render: (onSubmit) => <DynamicForm schema={legacyExample} onSubmit={onSubmit} />,
  },
  wizard: {
    label: 'Wizard',
    blurb: 'Multi-step form. Each step validates before you can advance.',
    render: (onSubmit) => (
      <DynamicForm.Wizard schema={wizardSchema} steps={wizardSteps} onSubmit={onSubmit} />
    ),
  },
  combobox: {
    label: 'Combobox (async)',
    blurb: 'A plain z.string() upgraded to a searchable async combobox via asyncOptions.',
    render: (onSubmit) => (
      <DynamicForm
        schema={comboboxSchema}
        asyncOptions={{ country: loadCountries }}
        onSubmit={onSubmit}
      />
    ),
  },
  i18n: {
    label: 'i18n (pt-BR)',
    blurb: 'Same schema, validation messages localized with a single locale prop.',
    render: (onSubmit) => (
      <DynamicForm schema={zodExample} locale="pt-BR" submitLabel="Enviar" onSubmit={onSubmit} />
    ),
  },
} satisfies Record<string, TabDef>

type Tab = keyof typeof tabs

export default function App() {
  const [tab, setTab] = useState<Tab>('zod')
  const [output, setOutput] = useState<unknown>(null)

  return (
    <div className="container">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">React Dynamic Forms</h1>
        <p className="text-muted-foreground">
          Zod-powered dynamic React forms. Try each schema input and feature below.
        </p>
      </header>

      <nav className="mb-6 flex flex-wrap gap-2 border-b border-border pb-2">
        {(Object.keys(tabs) as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t)
              setOutput(null)
            }}
            className={`rounded px-3 py-1.5 text-sm ${
              tab === t ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
          >
            {tabs[t].label}
          </button>
        ))}
      </nav>

      <p className="mb-4 text-sm text-muted-foreground">{tabs[tab].blurb}</p>

      <section className="rounded-md border border-border p-6">
        {tabs[tab].render((data) => setOutput(data))}
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
