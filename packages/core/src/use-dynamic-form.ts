import { useMemo } from 'react'
import {
  useForm,
  type UseFormProps,
  type UseFormReturn,
  type FieldValues,
  type DefaultValues,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ZodType } from 'zod'
import { detectAndConvert, type SchemaInput } from './adapters/detect'
import { isZodLike } from './adapters/is-zod'
import { internalToZod } from './schema-to-zod'
import type { InternalSchema } from './internal-schema'
import { createErrorMap, resolveMessages, type RdfLocaleInput, type RdfMessages } from './i18n'

export type UseDynamicFormOptions<TValues extends FieldValues = FieldValues> = {
  schema: SchemaInput
  defaultValues?: DefaultValues<TValues>
  mode?: UseFormProps<TValues>['mode']
  /** Built-in locale name ('en' | 'pt-BR' | 'es') or a custom message object. */
  locale?: RdfLocaleInput
  /** Per-key overrides applied on top of the locale. */
  messages?: RdfMessages
}

export type UseDynamicFormReturn<TValues extends FieldValues = FieldValues> = {
  form: UseFormReturn<TValues>
  internalSchema: InternalSchema
  zodSchema: ZodType<unknown>
}

export function useDynamicForm<TValues extends FieldValues = FieldValues>(
  options: UseDynamicFormOptions<TValues>,
): UseDynamicFormReturn<TValues> {
  const internalSchema = useMemo(() => detectAndConvert(options.schema), [options.schema])
  const zodSchema = useMemo<ZodType<unknown>>(
    () =>
      isZodLike(options.schema)
        ? (options.schema as ZodType<unknown>)
        : (internalToZod(internalSchema) as ZodType<unknown>),
    [options.schema, internalSchema],
  )
  const resolver = useMemo(() => {
    if (options.locale === undefined && options.messages === undefined) {
      return zodResolver(zodSchema)
    }
    const errorMap = createErrorMap(resolveMessages(options.locale, options.messages))
    return zodResolver(zodSchema, { errorMap })
  }, [zodSchema, options.locale, options.messages])

  const form = useForm<TValues>({
    resolver,
    defaultValues: options.defaultValues,
    mode: options.mode ?? 'onBlur',
  })

  return { form, internalSchema, zodSchema }
}
