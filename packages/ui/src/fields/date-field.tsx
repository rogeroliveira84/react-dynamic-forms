import type { DateFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { Input } from '../primitives/input'
import { FieldWrapper } from './field-wrapper'
import { useFieldState } from './use-field-state'

const HTML_TYPE: Record<DateFieldSpec['kind'], string> = {
  date: 'date',
  datetime: 'datetime-local',
  time: 'time',
}

export function DateField({ field }: { field: DateFieldSpec }) {
  const { register, wrapperProps } = useFieldState(field)
  return (
    <FieldWrapper {...wrapperProps}>
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
