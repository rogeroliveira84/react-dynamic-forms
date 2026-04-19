import type { FieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { TextField } from './text-field'
import { NumberField } from './number-field'
import { BooleanField } from './boolean-field'
import { DateField } from './date-field'
import { TextareaField } from './textarea-field'
import { EnumField } from './enum-field'
import { MultiEnumField } from './multi-enum-field'
import { SliderField } from './slider-field'
import { ObjectField } from './object-field'
import { ArrayField } from './array-field'

export function FieldResolver({ field }: { field: FieldSpec }) {
  if (field.hidden) return null
  switch (field.kind) {
    case 'text':
    case 'email':
    case 'password':
    case 'url':
      return <TextField field={field} />
    case 'textarea':
      return <TextareaField field={field} />
    case 'number':
      return <NumberField field={field} />
    case 'slider':
      return <SliderField field={field} />
    case 'boolean':
      return <BooleanField field={field} />
    case 'date':
    case 'datetime':
    case 'time':
      return <DateField field={field} />
    case 'enum':
      return <EnumField field={field} />
    case 'multi-enum':
      return <MultiEnumField field={field} />
    case 'object':
      return <ObjectField field={field} />
    case 'array':
      return <ArrayField field={field} />
  }
}
