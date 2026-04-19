import type { ArrayFieldSpec, FieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { useFieldArray, type Control, type FieldValues } from 'react-hook-form'
import { Button } from '../primitives/button'
import { FieldWrapper } from './field-wrapper'
import { FieldResolver } from './field-resolver'
import { useFieldState } from './use-field-state'

function emptyValueFor(item: FieldSpec): unknown {
  switch (item.kind) {
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

export function ArrayField({ field }: { field: ArrayFieldSpec }) {
  const { control, wrapperProps } = useFieldState(field)
  const { fields, append, remove } = useFieldArray<FieldValues, string>({
    control: control as unknown as Control<FieldValues>,
    name: field.name,
  })

  return (
    <FieldWrapper {...wrapperProps}>
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
          onClick={() => {
            // RHF's append signature is over-narrowed for dynamic name paths; item shape is guarded by emptyValueFor.
            append(emptyValueFor(field.item) as Parameters<typeof append>[0])
          }}
        >
          + Add
        </Button>
      </div>
    </FieldWrapper>
  )
}
