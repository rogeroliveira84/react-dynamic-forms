import type { NumberFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { Input } from '../primitives/input'
import { FieldWrapper } from './field-wrapper'
import { useFieldState } from './use-field-state'

export function NumberField({ field }: { field: NumberFieldSpec }) {
  const { register, wrapperProps } = useFieldState(field)
  return (
    <FieldWrapper {...wrapperProps}>
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
