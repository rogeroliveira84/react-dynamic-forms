import type { NumberFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { Controller, useFormContext } from 'react-hook-form'
import { Slider } from '../primitives/slider'
import { FieldWrapper } from './field-wrapper'
import { getErrorMessage } from './get-error'

export function SliderField({ field }: { field: NumberFieldSpec }) {
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
    >
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhf }) => (
          <Slider
            id={field.name}
            min={field.min ?? 0}
            max={field.max ?? 100}
            step={field.step ?? 1}
            value={[typeof rhf.value === 'number' ? rhf.value : (field.min ?? 0)]}
            onValueChange={(v) => rhf.onChange(v[0])}
          />
        )}
      />
    </FieldWrapper>
  )
}
