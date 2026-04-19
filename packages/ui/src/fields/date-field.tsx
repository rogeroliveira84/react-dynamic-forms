import type { DateFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { useFormContext } from 'react-hook-form'
import { Input } from '../primitives/input'
import { FieldWrapper } from './field-wrapper'
import { getErrorMessage } from './get-error'

const HTML_TYPE: Record<DateFieldSpec['kind'], string> = {
  date: 'date',
  datetime: 'datetime-local',
  time: 'time',
}

export function DateField({ field }: { field: DateFieldSpec }) {
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
        type={HTML_TYPE[field.kind]}
        min={field.min}
        max={field.max}
        {...register(field.name)}
      />
    </FieldWrapper>
  )
}
