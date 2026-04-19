import Link from 'next/link'
import { Playground } from './playground-client'

export default function PlaygroundPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="flex items-center justify-between">
        <div>
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            ← Back
          </Link>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">AI Playground</h1>
          <p className="text-sm text-muted-foreground">
            Describe your form → Claude generates a Zod schema → render it live.
          </p>
        </div>
      </header>

      <Playground />
    </main>
  )
}
