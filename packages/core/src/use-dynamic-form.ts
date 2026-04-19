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

export type UseDynamicFormOptions<TValues extends FieldValues = FieldValues> = {
  schema: SchemaInput
  defaultValues?: DefaultValues<TValues>
  mode?: UseFormProps<TValues>['mode']
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
  const resolver = useMemo(() => zodResolver(zodSchema), [zodSchema])

  const form = useForm<TValues>({
    resolver,
    defaultValues: options.defaultValues,
    mode: options.mode ?? 'onBlur',
  })

  return { form, internalSchema, zodSchema }
}
