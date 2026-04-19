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
        <p className="text-muted-foreground">
          Zod-powered dynamic React forms. Try each schema input below.
        </p>
      </header>

      <nav className="mb-6 flex gap-2 border-b border-border pb-2">
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

      <section className="rounded-md border border-border p-6">
        <DynamicForm schema={tabs[tab].schema} onSubmit={(data) => setOutput(data)} />
      </section>

      {output !== null && (
        <section className="mt-6 rounded-md border border-border p-4">
          <h3 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">
            Submitted
          </h3>
          <pre className="overflow-auto text-xs">{JSON.stringify(output, null, 2)}</pre>
        </section>
      )}
    </div>
  )
}
