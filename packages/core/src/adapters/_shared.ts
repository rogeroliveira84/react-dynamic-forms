import type { BaseFieldSpec } from '../internal-schema'

type BuildBaseInput = {
  name: string
  required: boolean
  label?: string
  description?: string
  placeholder?: string
  defaultValue?: unknown
}

export function buildBase(input: BuildBaseInput): BaseFieldSpec {
  const { name, required, label, description, placeholder, defaultValue } = input
  const out: BaseFieldSpec = { name, required }
  if (label) out.label = label
  if (description) out.description = description
  if (placeholder) out.placeholder = placeholder
  if (defaultValue !== undefined && defaultValue !== '') out.defaultValue = defaultValue
  return out
}

export function numberExtras(input: {
  min?: number | undefined
  max?: number | undefined
  step?: number | undefined
}): { min?: number; max?: number; step?: number } {
  const out: { min?: number; max?: number; step?: number } = {}
  if (input.min !== undefined) out.min = input.min
  if (input.max !== undefined) out.max = input.max
  if (input.step !== undefined) out.step = input.step
  return out
}

export function stringExtras(input: {
  minLength?: number | undefined
  maxLength?: number | undefined
  pattern?: string | undefined
}): { minLength?: number; maxLength?: number; pattern?: string } {
  const out: { minLength?: number; maxLength?: number; pattern?: string } = {}
  if (input.minLength !== undefined) out.minLength = input.minLength
  if (input.maxLength !== undefined) out.maxLength = input.maxLength
  if (input.pattern) out.pattern = input.pattern
  return out
}
