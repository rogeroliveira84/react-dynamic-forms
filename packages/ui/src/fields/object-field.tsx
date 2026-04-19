import type { ObjectFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { FieldWrapper } from './field-wrapper'
import { FieldResolver } from './field-resolver'
import { useFieldState } from './use-field-state'

export function ObjectField({ field }: { field: ObjectFieldSpec }) {
  const { wrapperProps } = useFieldState(field)
  return (
    <FieldWrapper {...wrapperProps}>
      <div className="flex flex-col gap-4 rounded-md border border-border p-4">
        {field.fields.map((f) => (
          <FieldResolver
            key={`${field.name}.${f.name}`}
            field={{ ...f, name: `${field.name}.${f.name}` }}
          />
        ))}
      </div>
    </FieldWrapper>
  )
}
