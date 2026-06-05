export { useDynamicForm } from './use-dynamic-form'
export type { UseDynamicFormOptions, UseDynamicFormReturn } from './use-dynamic-form'

export { detectAndConvert } from './adapters/detect'
export type { SchemaInput } from './adapters/detect'

export { zodToInternalSchema } from './adapters/zod'
export { jsonSchemaToInternalSchema } from './adapters/json-schema'
export type { JsonSchema } from './adapters/json-schema'
export { legacyConfigToInternalSchema } from './adapters/legacy'
export type { LegacyConfig, LegacyField, LegacyOption } from './adapters/legacy'

export { internalToZod } from './schema-to-zod'

export { createErrorMap, resolveMessages, en, ptBR, es } from './i18n'
export type {
  RdfLocale,
  RdfLocaleInput,
  RdfMessages,
  RdfMessageKey,
  RdfMessageValue,
  RdfMessageParams,
} from './i18n'

export type {
  InternalSchema,
  FieldSpec,
  FieldKind,
  EnumOption,
  ShowIfRule,
  BaseFieldSpec,
  TextLikeFieldSpec,
  NumberFieldSpec,
  BooleanFieldSpec,
  DateFieldSpec,
  EnumFieldSpec,
  ComboboxFieldSpec,
  ObjectFieldSpec,
  ArrayFieldSpec,
  FileFieldSpec,
} from './internal-schema'
