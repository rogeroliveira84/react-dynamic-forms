'use client'

import { useState } from 'react'
import { DynamicForm } from '@rogeroliveira84/react-dynamic-forms-ui'
import type { InternalSchema } from '@rogeroliveira84/react-dynamic-forms'
import { Check, Copy, Sparkles } from 'lucide-react'

const PRESETS = [
  'A signup form for a SaaS app with email, password, company name, and team size',
  'A job application for a software engineer with skills, years of experience, and portfolio link',
  'An invoice with client name, line items (description + quantity + price), and payment terms',
  'A product configuration for a laptop with CPU, RAM, storage, and color',
  'A feedback form that asks "how did you hear about us" and shows a follow-up field only if "other"',
]

type Result = {
  internalSchema: InternalSchema
  zodCode: string
}

export function Playground() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [submitted, setSubmitted] = useState<unknown>(null)
  const [copied, setCopied] = useState(false)

  async function generate() {
    if (!prompt.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    setSubmitted(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ from: 'text', prompt }),
      })
      if (!res.ok) {
        const body = await res.text()
        throw new Error(body || `HTTP ${res.status}`)
      }
      const data = (await res.json()) as Result
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  async function copyCode() {
    if (!result) return
    await navigator.clipboard.writeText(result.zodCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3 rounded-lg border border-border bg-muted/20 p-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the form you need…"
          rows={3}
          className="w-full resize-none rounded-md border border-input bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPrompt(p)}
              className="rounded border border-input px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
            >
              {p.slice(0, 40)}…
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Powered by Claude via the Vercel AI SDK.
          </span>
          <button
            type="button"
            onClick={generate}
            disabled={loading || !prompt.trim()}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            {loading ? 'Generating…' : 'Generate'}
          </button>
        </div>
        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
      </section>

      {result && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="flex flex-col gap-2 rounded-lg border border-border p-5">
            <div className="text-sm font-medium">Live preview</div>
            <DynamicForm
              schema={result.internalSchema}
              onSubmit={(data) => setSubmitted(data)}
            />
          </section>
          <section className="flex flex-col gap-2 rounded-lg border border-border p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Generated Zod code</div>
              <button
                type="button"
                onClick={copyCode}
                className="inline-flex items-center gap-1 rounded border border-input px-2 py-1 text-xs hover:bg-muted"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="mono max-h-[520px] overflow-auto rounded bg-muted/30 p-3 text-xs leading-6">
              <code>{result.zodCode}</code>
            </pre>
          </section>
        </div>
      )}

      {submitted !== null && (
        <section className="flex flex-col gap-2 rounded-lg border border-border p-5">
          <div className="text-sm font-medium">Submit output</div>
          <pre className="mono overflow-auto text-xs leading-6">
            {JSON.stringify(submitted, null, 2)}
          </pre>
        </section>
      )}
    </div>
  )
}
