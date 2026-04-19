import type { EnumFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { Controller } from 'react-hook-form'
import { Checkbox } from '../primitives/checkbox'
import { Label } from '../primitives/label'
import { FieldWrapper } from './field-wrapper'
import { useFieldState } from './use-field-state'

export function MultiEnumField({ field }: { field: EnumFieldSpec }) {
  const { control, wrapperProps } = useFieldState(field)
  return (
    <FieldWrapper {...wrapperProps}>
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhf }) => {
          const value: readonly (string | number)[] = Array.isArray(rhf.value) ? rhf.value : []
          const toggle = (v: string | number) => {
            const has = value.includes(v)
            rhf.onChange(has ? value.filter((x) => x !== v) : [...value, v])
          }
          return (
            <div className="flex flex-col gap-2">
              {field.options.map((opt) => {
                const id = `${field.name}-${String(opt.value)}`
                return (
                  <div key={id} className="flex items-center gap-2">
                    <Checkbox
                      id={id}
                      checked={value.includes(opt.value)}
                      onCheckedChange={() => toggle(opt.value)}
                    />
                    <Label htmlFor={id}>{opt.label}</Label>
                  </div>
                )
              })}
            </div>
          )
        }}
      />
    </FieldWrapper>
  )
}
