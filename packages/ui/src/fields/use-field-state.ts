import type { FieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { useFormContext, useFormState, type Control, type UseFormRegister } from 'react-hook-form'
import type { FieldWrapperProps } from './field-wrapper'

export type FieldState = {
  register: UseFormRegister<Record<string, unknown>>
  control: Control<Record<string, unknown>>
  error: string | undefined
  wrapperProps: Omit<FieldWrapperProps, 'children'>
}

function extractErrorMessage(errors: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.')
  let current: unknown = errors
  for (const part of parts) {
    if (current && typeof current === 'object' && part in (current as object)) {
      current = (current as Record<string, unknown>)[part]
    } else {
      return undefined
    }
  }
  if (current && typeof current === 'object' && 'message' in (current as object)) {
    const msg = (current as { message?: unknown }).message
    return typeof msg === 'string' ? msg : undefined
  }
  return undefined
}

export function useFieldState(field: FieldSpec): FieldState {
  const { register, control } = useFormContext<Record<string, unknown>>()
  const { errors } = useFormState({ control, name: field.name })
  const error = extractErrorMessage(errors as Record<string, unknown>, field.name)

  const wrapperProps: Omit<FieldWrapperProps, 'children'> = {
    id: field.name,
    label: field.label ?? field.name,
  }
  if (field.description) wrapperProps.description = field.description
  if (field.required !== undefined) wrapperProps.required = field.required
  if (error !== undefined) wrapperProps.error = error

  return { register, control, error, wrapperProps }
}
