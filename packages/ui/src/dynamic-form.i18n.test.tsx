import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { z } from 'zod'
import { DynamicForm } from './dynamic-form'

describe('<DynamicForm> i18n', () => {
  it('shows a localized (pt-BR) validation message on submit', async () => {
    render(
      <DynamicForm schema={z.object({ email: z.string().email() })} locale="pt-BR" onSubmit={() => {}} />,
    )
    await userEvent.type(screen.getByLabelText(/email/i), 'nope')
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(await screen.findByText('Informe um e-mail válido')).toBeInTheDocument()
  })

  it('keeps English when no locale is given', async () => {
    render(<DynamicForm schema={z.object({ email: z.string().email() })} onSubmit={() => {}} />)
    await userEvent.type(screen.getByLabelText(/email/i), 'nope')
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument()
  })
})
