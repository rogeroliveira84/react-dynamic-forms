import { FormProvider, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { useDynamicForm, type SchemaInput } from '@rogeroliveira84/react-dynamic-forms'
import { Button } from './primitives/button'
import { FieldResolver } from './fields/field-resolver'
import { cn } from './utils/cn'

export type DynamicFormProps<TValues extends FieldValues = FieldValues> = {
  schema?: SchemaInput
  onSubmit: SubmitHandler<TValues>
  defaultValues?: Parameters<typeof useDynamicForm<TValues>>[0]['defaultValues']
  submitLabel?: string
  className?: string
  title?: string
  description?: string
  showSubmit?: boolean
  /** Legacy prop from v0.5 — renamed to `schema`. Kept for 1 major version. */
  config?: SchemaInput
}

export function DynamicForm<TValues extends FieldValues = FieldValues>(
  props: DynamicFormProps<TValues>,
) {
  const actualSchema = props.schema ?? props.config
  if (!actualSchema) throw new Error('DynamicForm requires a `schema` prop.')
  if (props.config && !props.schema && typeof console !== 'undefined') {
    console.warn(
      '[react-dynamic-forms] `config` prop is deprecated — rename to `schema`. See migration guide.',
    )
  }

  const { form, internalSchema } = useDynamicForm<TValues>({
    schema: actualSchema,
    defaultValues: props.defaultValues,
  })

  const title = props.title ?? internalSchema.title
  const description = props.description ?? internalSchema.description

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(props.onSubmit)}
        className={cn('flex flex-col gap-4', props.className)}
        noValidate
      >
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {internalSchema.fields.map((f) => (
          <FieldResolver key={f.name} field={f} />
        ))}
        {props.showSubmit !== false && (
          <div className="mt-2">
            <Button type="submit">{props.submitLabel ?? 'Submit'}</Button>
          </div>
        )}
      </form>
    </FormProvider>
  )
}
