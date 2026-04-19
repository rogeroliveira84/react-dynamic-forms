export { useDynamicForm } from './use-dynamic-form'
export type { UseDynamicFormOptions, UseDynamicFormReturn } from './use-dynamic-form'

export { detectAndConvert } from './adapters/detect'
export type { SchemaInput } from './adapters/detect'

export { zodToInternalSchema } from './adapters/zod'
export { jsonSchemaToInternalSchema } from './adapters/json-schema'
export type { JsonSchema } from './adapters/json-schema'
export { legacyConfigToInternalSchema } from './adapters/legacy'
export type { LegacyConfig, LegacyField, LegacyOption } from './adapters/legacy'

export type {
  InternalSchema,
  FieldSpec,
  FieldKind,
  EnumOption,
  BaseFieldSpec,
  TextLikeFieldSpec,
  NumberFieldSpec,
  BooleanFieldSpec,
  DateFieldSpec,
  EnumFieldSpec,
  ObjectFieldSpec,
  ArrayFieldSpec,
} from './internal-schema'
