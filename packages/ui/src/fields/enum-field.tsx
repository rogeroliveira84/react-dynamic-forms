import type { EnumFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { Controller } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../primitives/select'
import { FieldWrapper } from './field-wrapper'
import { useFieldState } from './use-field-state'

export function EnumField({ field }: { field: EnumFieldSpec }) {
  const { control, wrapperProps } = useFieldState(field)
  return (
    <FieldWrapper {...wrapperProps}>
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhf }) => (
          <Select
            value={rhf.value === undefined || rhf.value === null ? '' : String(rhf.value)}
            onValueChange={(next) => {
              const match = field.options.find((o) => String(o.value) === next)
              rhf.onChange(match ? match.value : next)
            }}
          >
            <SelectTrigger id={field.name}>
              <SelectValue placeholder={field.placeholder ?? 'Select…'} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((opt) => (
                <SelectItem key={String(opt.value)} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FieldWrapper>
  )
}
