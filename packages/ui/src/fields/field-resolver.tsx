import type { FieldSpec, ComboboxFieldSpec, ShowIfRule } from '@rogeroliveira84/react-dynamic-forms'
import { useWatch } from 'react-hook-form'
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
import { FileField } from './file-field'
import { ComboboxField } from './combobox-field'
import { useRdfConfig } from './rdf-config'

function renderField(field: FieldSpec) {
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
    case 'combobox':
      return <ComboboxField field={field} />
    case 'object':
      return <ObjectField field={field} />
    case 'array':
      return <ArrayField field={field} />
    case 'file':
      return <FileField field={field} />
  }
}

function ConditionalField({ field, rule }: { field: FieldSpec; rule: ShowIfRule }) {
  const watched = useWatch({ name: rule.field })
  if (watched !== rule.equals) return null
  return renderField(field)
}

export function FieldResolver({ field }: { field: FieldSpec }) {
  const { asyncOptions } = useRdfConfig()
  if (field.hidden) return null
  if (field.showIf) return <ConditionalField field={field} rule={field.showIf} />
  // A registered async loader upgrades any field into a searchable async combobox.
  if (asyncOptions?.[field.name] && field.kind !== 'combobox') {
    const { kind: _kind, ...rest } = field
    const upgraded = { ...rest, kind: 'combobox' } as ComboboxFieldSpec
    return <ComboboxField field={upgraded} />
  }
  return renderField(field)
}
