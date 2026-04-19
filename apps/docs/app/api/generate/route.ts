import { NextRequest, NextResponse } from 'next/server'
import { anthropic } from '@ai-sdk/anthropic'
import { generateSchema, type GenerateInput } from '@rogeroliveira84/react-dynamic-forms-ai'

export const runtime = 'nodejs'
export const maxDuration = 30

const rateLimiter = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 10

function clientId(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'anonymous'
  )
}

function rateLimit(id: string): boolean {
  const now = Date.now()
  const entry = rateLimiter.get(id)
  if (!entry || entry.resetAt < now) {
    rateLimiter.set(id, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= MAX_PER_WINDOW) return false
  entry.count += 1
  return true
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'Playground is not configured. Set ANTHROPIC_API_KEY on the server.' },
      { status: 500 },
    )
  }

  const id = clientId(req)
  if (!rateLimit(id)) {
    return NextResponse.json({ error: 'Rate limit exceeded — try again in a minute.' }, { status: 429 })
  }

  let input: GenerateInput
  try {
    const body = (await req.json()) as GenerateInput
    if (body.from !== 'text' && body.from !== 'typescript' && body.from !== 'json-sample') {
      return NextResponse.json({ error: 'Invalid `from` value' }, { status: 400 })
    }
    input = body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    const result = await generateSchema({
      ...input,
      model: anthropic('claude-sonnet-4-6'),
    } as Parameters<typeof generateSchema>[0])
    return NextResponse.json({
      internalSchema: result.internalSchema,
      zodCode: result.zodCode,
      jsonSchema: result.jsonSchema,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
