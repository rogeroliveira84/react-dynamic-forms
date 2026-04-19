import type { NumberFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { Controller } from 'react-hook-form'
import { Slider } from '../primitives/slider'
import { FieldWrapper } from './field-wrapper'
import { useFieldState } from './use-field-state'

export function SliderField({ field }: { field: NumberFieldSpec }) {
  const { control, wrapperProps } = useFieldState(field)
  return (
    <FieldWrapper {...wrapperProps}>
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
            onValueChange={(next) => rhf.onChange(next[0])}
          />
        )}
      />
    </FieldWrapper>
  )
}
