import { describe, it, expect, vi } from 'vitest'
import { z } from 'zod'
import { detectAndConvert } from './detect'

describe('detectAndConvert', () => {
  it('detects Zod schema by _def', () => {
    const zs = z.object({ name: z.string() })
    expect(detectAndConvert(zs).fields[0]).toMatchObject({ name: 'name' })
  })

  it('detects JSON Schema by type + properties', () => {
    const js = { type: 'object', properties: { a: { type: 'string' } } } as const
    expect(detectAndConvert(js).fields[0]).toMatchObject({ name: 'a' })
  })

  it('detects legacy config by fields array', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const legacy = {
      name: 'F',
      fields: [{ id: 'x', label: 'X', type: 'text' as const, value: '', required: 'false' as const }],
    }
    expect(detectAndConvert(legacy).fields[0]).toMatchObject({ name: 'x' })
    warn.mockRestore()
  })

  it('returns InternalSchema as-is when detected', () => {
    const internal = { fields: [{ kind: 'text' as const, name: 'x', required: false }] }
    expect(detectAndConvert(internal)).toBe(internal)
  })

  it('throws on unrecognized input', () => {
    expect(() => detectAndConvert({ foo: 'bar' } as unknown as Parameters<typeof detectAndConvert>[0])).toThrow(
      /unrecognized schema/i,
    )
  })
})
