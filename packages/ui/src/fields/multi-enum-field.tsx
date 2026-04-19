import type { EnumFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { Controller, useFormContext } from 'react-hook-form'
import { Checkbox } from '../primitives/checkbox'
import { Label } from '../primitives/label'
import { FieldWrapper } from './field-wrapper'
import { getErrorMessage } from './get-error'

export function MultiEnumField({ field }: { field: EnumFieldSpec }) {
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
        render={({ field: rhf }) => {
          const value: (string | number)[] = Array.isArray(rhf.value) ? rhf.value : []
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
