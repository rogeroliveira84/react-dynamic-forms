import type { TextLikeFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { useFormContext } from 'react-hook-form'
import { Input } from '../primitives/input'
import { FieldWrapper } from './field-wrapper'
import { getErrorMessage } from './get-error'

const HTML_TYPE_MAP: Record<string, string> = {
  text: 'text',
  email: 'email',
  password: 'password',
  url: 'url',
  textarea: 'text',
}

export function TextField({ field }: { field: TextLikeFieldSpec }) {
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
        type={HTML_TYPE_MAP[field.kind] ?? 'text'}
        placeholder={field.placeholder}
        {...register(field.name)}
      />
    </FieldWrapper>
  )
}
