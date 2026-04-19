import type { NumberFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { useFormContext } from 'react-hook-form'
import { Input } from '../primitives/input'
import { FieldWrapper } from './field-wrapper'
import { getErrorMessage } from './get-error'

export function NumberField({ field }: { field: NumberFieldSpec }) {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const error = getErrorMessage(errors as Record<string, unknown>, field.name)
  return (
    <FieldWrapper
      id={field.name}
      label={field.label ?? field.name}
      description={field.description}
      required={field.required}
      error={error}
    >
      <Input
        id={field.name}
        type="number"
        min={field.min}
        max={field.max}
        step={field.step}
        placeholder={field.placeholder}
        {...register(field.name, { valueAsNumber: true })}
      />
    </FieldWrapper>
  )
}
