import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { z } from 'zod'
import { DynamicForm } from './dynamic-form'

describe('<DynamicForm>', () => {
  it('renders fields from a Zod schema', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
      subscribe: z.boolean(),
    })
    render(<DynamicForm schema={schema} onSubmit={() => {}} />)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/subscribe/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('submits valid values', async () => {
    const onSubmit = vi.fn()
    const schema = z.object({ email: z.string().email() })
    render(<DynamicForm schema={schema} onSubmit={onSubmit} />)
    await userEvent.type(screen.getByLabelText(/email/i), 'x@y.com')
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit.mock.calls[0]?.[0]).toMatchObject({ email: 'x@y.com' })
  })

  it('shows validation error for invalid email', async () => {
    const schema = z.object({ email: z.string().email() })
    render(<DynamicForm schema={schema} onSubmit={() => {}} />)
    await userEvent.type(screen.getByLabelText(/email/i), 'not-email')
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('renders from JSON Schema input', () => {
    const jsonSchema = {
      type: 'object' as const,
      properties: { title: { type: 'string', description: 'Document title' } },
      required: ['title'],
    }
    render(<DynamicForm schema={jsonSchema} onSubmit={() => {}} />)
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
  })

  it('renders from legacy config with deprecation warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const legacy = {
      name: 'Legacy',
      fields: [
        {
          id: 'nm',
          label: 'NM',
          type: 'text' as const,
          value: '',
          required: 'false' as const,
        },
      ],
    }
    render(<DynamicForm schema={legacy} onSubmit={() => {}} />)
    expect(screen.getByLabelText(/nm/i)).toBeInTheDocument()
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })
})
