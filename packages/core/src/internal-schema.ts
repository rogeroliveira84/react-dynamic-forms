export type FieldKind =
  | 'text'
  | 'email'
  | 'password'
  | 'url'
  | 'number'
  | 'slider'
  | 'textarea'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'time'
  | 'enum'
  | 'multi-enum'
  | 'object'
  | 'array'
  | 'file'

export type EnumOption = { value: string | number; label: string }

export type ShowIfRule = {
  field: string
  equals: string | number | boolean
}

type BaseFieldSpec = {
  name: string
  label?: string
  description?: string
  placeholder?: string
  required?: boolean
  defaultValue?: unknown
  disabled?: boolean
  hidden?: boolean
  showIf?: ShowIfRule
}

export type TextLikeFieldSpec = BaseFieldSpec & {
  kind: 'text' | 'email' | 'password' | 'url' | 'textarea'
  minLength?: number
  maxLength?: number
  pattern?: string
}

export type NumberFieldSpec = BaseFieldSpec & {
  kind: 'number' | 'slider'
  min?: number
  max?: number
  step?: number
}

export type BooleanFieldSpec = BaseFieldSpec & { kind: 'boolean' }

export type DateFieldSpec = BaseFieldSpec & {
  kind: 'date' | 'datetime' | 'time'
  min?: string
  max?: string
}

export type EnumFieldSpec = BaseFieldSpec & {
  kind: 'enum' | 'multi-enum'
  options: EnumOption[]
}

export type ObjectFieldSpec = BaseFieldSpec & {
  kind: 'object'
  fields: FieldSpec[]
}

export type ArrayFieldSpec = BaseFieldSpec & {
  kind: 'array'
  item: FieldSpec
  minItems?: number
  maxItems?: number
}

export type FileFieldSpec = BaseFieldSpec & {
  kind: 'file'
  accept?: string
  maxSize?: number
  multiple?: boolean
}

export type FieldSpec =
  | TextLikeFieldSpec
  | NumberFieldSpec
  | BooleanFieldSpec
  | DateFieldSpec
  | EnumFieldSpec
  | ObjectFieldSpec
  | ArrayFieldSpec
  | FileFieldSpec

export type InternalSchema = {
  title?: string
  description?: string
  fields: FieldSpec[]
}

export type { BaseFieldSpec }
