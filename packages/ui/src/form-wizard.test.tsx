import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { z } from 'zod'
import { FormWizard } from './form-wizard'
import { DynamicForm } from './dynamic-form'

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
})
const steps = [
  { title: 'Account', fields: ['email'] },
  { title: 'Profile', fields: ['name'] },
]

describe('<FormWizard>', () => {
  it('renders only the first step initially', () => {
    render(<FormWizard schema={schema} steps={steps} onSubmit={() => {}} />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/^name/i)).not.toBeInTheDocument()
  })

  it('blocks Next while the current step is invalid', async () => {
    render(<FormWizard schema={schema} steps={steps} onSubmit={() => {}} />)
    await userEvent.type(screen.getByLabelText(/email/i), 'bad')
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/^name/i)).not.toBeInTheDocument()
  })

  it('advances to the next step when the current step is valid', async () => {
    render(<FormWizard schema={schema} steps={steps} onSubmit={() => {}} />)
    await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com')
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(await screen.findByLabelText(/^name/i)).toBeInTheDocument()
  })

  it('keeps values when going Back', async () => {
    render(<FormWizard schema={schema} steps={steps} onSubmit={() => {}} />)
    await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com')
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    await userEvent.click(await screen.findByRole('button', { name: /back/i }))
    expect((screen.getByLabelText(/email/i) as HTMLInputElement).value).toBe('a@b.com')
  })

  it('submits on the last step with all values', async () => {
    const onSubmit = vi.fn()
    render(<FormWizard schema={schema} steps={steps} onSubmit={onSubmit} />)
    await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com')
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    await userEvent.type(await screen.findByLabelText(/^name/i), 'Roger')
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit.mock.calls[0]?.[0]).toMatchObject({ email: 'a@b.com', name: 'Roger' })
  })

  it('is exposed as the compound component DynamicForm.Wizard', () => {
    expect(DynamicForm.Wizard).toBe(FormWizard)
  })

  it('warns when steps do not cover all schema fields', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<FormWizard schema={schema} steps={[{ fields: ['email'] }]} onSubmit={() => {}} />)
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })
})
