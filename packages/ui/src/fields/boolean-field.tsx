import type { BooleanFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { Controller, useFormContext } from 'react-hook-form'
import { Checkbox } from '../primitives/checkbox'
import { FieldWrapper } from './field-wrapper'
import { getErrorMessage } from './get-error'

export function BooleanField({ field }: { field: BooleanFieldSpec }) {
  const {
    control,
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
      layout="label-inline"
    >
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
