import type { EnumFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { Controller, useFormContext } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../primitives/select'
import { FieldWrapper } from './field-wrapper'
import { getErrorMessage } from './get-error'

export function EnumField({ field }: { field: EnumFieldSpec }) {
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
          <Select value={rhf.value === undefined || rhf.value === null ? '' : String(rhf.value)} onValueChange={(v) => {
            const match = field.options.find((o) => String(o.value) === v)
            rhf.onChange(match ? match.value : v)
          }}>
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
