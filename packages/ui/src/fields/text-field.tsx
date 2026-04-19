import type { TextLikeFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { Input } from '../primitives/input'
import { FieldWrapper } from './field-wrapper'
import { useFieldState } from './use-field-state'

const HTML_TYPE: Record<Exclude<TextLikeFieldSpec['kind'], 'textarea'>, string> = {
  text: 'text',
  email: 'email',
  password: 'password',
  url: 'url',
}

export function TextField({ field }: { field: TextLikeFieldSpec }) {
  const { register, wrapperProps } = useFieldState(field)
  const type = field.kind === 'textarea' ? 'text' : HTML_TYPE[field.kind]
  return (
    <FieldWrapper {...wrapperProps}>
      <Input id={field.name} type={type} placeholder={field.placeholder} {...register(field.name)} />
    </FieldWrapper>
  )
}
