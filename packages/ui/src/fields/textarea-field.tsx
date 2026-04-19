import type { TextLikeFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { useFormContext } from 'react-hook-form'
import { Textarea } from '../primitives/textarea'
import { FieldWrapper } from './field-wrapper'
import { getErrorMessage } from './get-error'

export function TextareaField({ field }: { field: TextLikeFieldSpec }) {
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
      <Textarea id={field.name} placeholder={field.placeholder} {...register(field.name)} />
    </FieldWrapper>
  )
}
