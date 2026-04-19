import { useMemo } from 'react'
import {
  useForm,
  type UseFormProps,
  type UseFormReturn,
  type FieldValues,
  type DefaultValues,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ZodTypeAny } from 'zod'
import { detectAndConvert, type SchemaInput } from './adapters/detect'
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
  zodSchema: ZodTypeAny
}

function isZodLike(input: unknown): boolean {
  return (
    typeof input === 'object' &&
    input !== null &&
    '_def' in (input as object) &&
    'parse' in (input as object)
  )
}

export function useDynamicForm<TValues extends FieldValues = FieldValues>(
  options: UseDynamicFormOptions<TValues>,
): UseDynamicFormReturn<TValues> {
  const internalSchema = useMemo(() => detectAndConvert(options.schema), [options.schema])
  const zodSchema = useMemo(() => {
    if (isZodLike(options.schema)) return options.schema as ZodTypeAny
    return internalToZod(internalSchema)
  }, [options.schema, internalSchema])

  const form = useForm<TValues>({
    resolver: zodResolver(zodSchema),
    defaultValues: options.defaultValues,
    mode: options.mode ?? 'onBlur',
  })

  return { form, internalSchema, zodSchema }
}
