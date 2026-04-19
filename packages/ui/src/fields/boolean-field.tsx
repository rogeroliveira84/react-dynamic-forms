import type { BooleanFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { Controller } from 'react-hook-form'
import { Checkbox } from '../primitives/checkbox'
import { FieldWrapper } from './field-wrapper'
import { useFieldState } from './use-field-state'

export function BooleanField({ field }: { field: BooleanFieldSpec }) {
  const { control, wrapperProps } = useFieldState(field)
  return (
    <FieldWrapper {...wrapperProps} layout="label-inline">
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhf }) => (
          <Checkbox
            id={field.name}
            checked={Boolean(rhf.value)}
            onCheckedChange={(v) => rhf.onChange(Boolean(v))}
          />
        )}
      />
    </FieldWrapper>
  )
}
