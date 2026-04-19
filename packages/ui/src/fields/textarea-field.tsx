import type { TextLikeFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { Textarea } from '../primitives/textarea'
import { FieldWrapper } from './field-wrapper'
import { useFieldState } from './use-field-state'

export function TextareaField({ field }: { field: TextLikeFieldSpec }) {
  const { register, wrapperProps } = useFieldState(field)
  return (
    <FieldWrapper {...wrapperProps}>
      <Textarea id={field.name} placeholder={field.placeholder} {...register(field.name)} />
    </FieldWrapper>
  )
}
