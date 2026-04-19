import { describe, it, expect, vi } from 'vitest'

vi.mock('ai', () => ({
  generateObject: vi.fn(),
}))

import { generateObject } from 'ai'
import { generateSchema } from './index'

const mockModel = { modelId: 'mock' } as unknown as Parameters<typeof generateSchema>[0]['model']

describe('generateSchema', () => {
  it('returns internalSchema + zodCode + jsonSchema from mocked AI output', async () => {
    vi.mocked(generateObject).mockResolvedValueOnce({
      object: {
        title: 'Signup',
        fields: [
          { kind: 'email', name: 'email', required: true },
          { kind: 'text', name: 'name', required: true, minLength: 2 },
        ],
      },
    } as unknown as Awaited<ReturnType<typeof generateObject>>)

    const result = await generateSchema({
      from: 'text',
      prompt: 'A simple signup form',
      model: mockModel,
    })

    expect(result.internalSchema.fields).toHaveLength(2)
    expect(result.zodCode).toContain('email: z.string().email()')
    expect(result.zodCode).toContain('name: z.string().min(2)')
    expect(result.jsonSchema.properties?.email).toMatchObject({ format: 'email' })
  })

  it('passes the correct user prompt shape for each input mode', async () => {
    const spy = vi.mocked(generateObject)
    spy.mockResolvedValue({
      object: { fields: [{ kind: 'text', name: 'x', required: true }] },
    } as unknown as Awaited<ReturnType<typeof generateObject>>)

    await generateSchema({ from: 'text', prompt: 'hello', model: mockModel })
    const textArgs = spy.mock.calls[spy.mock.calls.length - 1]?.[0]
    expect(textArgs?.prompt).toContain('hello')

    await generateSchema({
      from: 'typescript',
      source: 'interface X { a: string }',
      model: mockModel,
    })
    const tsArgs = spy.mock.calls[spy.mock.calls.length - 1]?.[0]
    expect(tsArgs?.prompt).toContain('interface X')

    await generateSchema({
      from: 'json-sample',
      sample: { foo: 'bar' },
      hint: 'user profile',
      model: mockModel,
    })
    const jsonArgs = spy.mock.calls[spy.mock.calls.length - 1]?.[0]
    expect(jsonArgs?.prompt).toContain('user profile')
    expect(jsonArgs?.prompt).toContain('foo')
  })
})
