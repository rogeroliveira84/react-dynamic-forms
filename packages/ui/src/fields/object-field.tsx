import type { ObjectFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { FieldWrapper } from './field-wrapper'
import { FieldResolver } from './field-resolver'

export function ObjectField({ field }: { field: ObjectFieldSpec }) {
  return (
    <FieldWrapper
      id={field.name}
      label={field.label ?? field.name}
      description={field.description}
    >
      <div className="flex flex-col gap-4 rounded-md border border-border p-4">
        {field.fields.map((f) => (
          <FieldResolver key={`${field.name}.${f.name}`} field={{ ...f, name: `${field.name}.${f.name}` }} />
        ))}
      </div>
    </FieldWrapper>
  )
}
