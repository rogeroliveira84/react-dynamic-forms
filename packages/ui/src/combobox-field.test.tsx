import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { z } from 'zod'
import { DynamicForm } from './dynamic-form'

describe('combobox', () => {
  const staticSchema = {
    type: 'object' as const,
    properties: {
      fruit: {
        type: 'string' as const,
        enum: ['Apple', 'Banana', 'Cherry'],
        'x-rdf-combobox': true,
      },
    },
    required: ['fruit'],
  }

  it('opens, filters static options, and selects one', async () => {
    const onSubmit = vi.fn()
    render(<DynamicForm schema={staticSchema} onSubmit={onSubmit} />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.type(screen.getByPlaceholderText(/search/i), 'ban')
    await userEvent.click(screen.getByText('Banana'))
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit.mock.calls[0]?.[0]).toMatchObject({ fruit: 'Banana' })
  })

  it('loads async options via asyncOptions and selects one', async () => {
    const onSubmit = vi.fn()
    const loadOptions = vi.fn(async (q: string) =>
      [
        { value: 'br', label: 'Brazil' },
        { value: 'us', label: 'United States' },
      ].filter((o) => o.label.toLowerCase().includes(q.toLowerCase())),
    )
    render(
      <DynamicForm
        schema={z.object({ country: z.string() })}
        asyncOptions={{ country: loadOptions }}
        onSubmit={onSubmit}
      />,
    )
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.type(screen.getByPlaceholderText(/search/i), 'bra')
    await userEvent.click(await screen.findByText('Brazil'))
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(loadOptions).toHaveBeenCalled()
    expect(onSubmit.mock.calls[0]?.[0]).toMatchObject({ country: 'br' })
  })
})
