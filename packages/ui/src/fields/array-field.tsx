import type { ArrayFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '../primitives/button'
import { FieldWrapper } from './field-wrapper'
import { FieldResolver } from './field-resolver'
import { getErrorMessage } from './get-error'

export function ArrayField({ field }: { field: ArrayFieldSpec }) {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const { fields, append, remove } = useFieldArray({ control, name: field.name })
  const error = getErrorMessage(errors as Record<string, unknown>, field.name)

  const defaultAppend = (): unknown => {
    switch (field.item.kind) {
      case 'number':
      case 'slider':
        return 0
      case 'boolean':
        return false
      case 'object':
        return {}
      case 'array':
      case 'multi-enum':
        return []
      default:
        return ''
    }
  }

  return (
    <FieldWrapper
      id={field.name}
      label={field.label ?? field.name}
      description={field.description}
      required={field.required}
      error={error}
    >
      <div className="flex flex-col gap-3">
        {fields.map((f, i) => (
          <div key={f.id} className="flex items-start gap-2">
            <div className="flex-1">
              <FieldResolver field={{ ...field.item, name: `${field.name}.${i}` }} />
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => remove(i)}>
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append(defaultAppend() as never)}
        >
          + Add
        </Button>
      </div>
    </FieldWrapper>
  )
}
