import { FormProvider, type FieldValues, type SubmitHandler, type DefaultValues } from 'react-hook-form'
import {
  useDynamicForm,
  type SchemaInput,
  type RdfLocaleInput,
  type RdfMessages,
} from '@rogeroliveira84/react-dynamic-forms'
import type { ReactElement } from 'react'
import { Button } from './primitives/button'
import { FieldResolver } from './fields/field-resolver'
import { RdfConfigProvider, type AsyncOptionsMap } from './fields/rdf-config'
import { FormWizard } from './form-wizard'
import { cn } from './utils/cn'

export type DynamicFormProps<TValues extends FieldValues = FieldValues> = {
  schema?: SchemaInput
  onSubmit: SubmitHandler<TValues>
  defaultValues?: DefaultValues<TValues>
  submitLabel?: string
  className?: string
  title?: string
  description?: string
  showSubmit?: boolean
  /** Built-in locale name ('en' | 'pt-BR' | 'es') or a custom message object for validation messages. */
  locale?: RdfLocaleInput
  /** Per-key overrides applied on top of the locale. */
  messages?: RdfMessages
  /** Async option loaders keyed by field name. A field with a loader renders as a searchable combobox. */
  asyncOptions?: AsyncOptionsMap
  /** @deprecated Renamed to `schema`. Kept working with a warning through v1; removed in v2. */
  config?: SchemaInput
}

function DynamicFormComponent<TValues extends FieldValues = FieldValues>(
  props: DynamicFormProps<TValues>,
): ReactElement | null {
  const schemaInput = props.schema ?? props.config
  if (!schemaInput) {
    console.error('[react-dynamic-forms] <DynamicForm> requires a `schema` prop; nothing rendered.')
    return null
  }
  if (props.config && !props.schema) {
    console.warn(
      '[react-dynamic-forms] `config` prop is deprecated — rename to `schema`. See migration guide.',
    )
  }

  const { form, internalSchema } = useDynamicForm<TValues>({
    schema: schemaInput,
    defaultValues: props.defaultValues,
    locale: props.locale,
    messages: props.messages,
  })

  const title = props.title ?? internalSchema.title
  const description = props.description ?? internalSchema.description

  return (
    <RdfConfigProvider value={{ asyncOptions: props.asyncOptions }}>
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
    </RdfConfigProvider>
  )
}

type DynamicFormType = {
  <TValues extends FieldValues = FieldValues>(props: DynamicFormProps<TValues>): ReactElement | null
  Wizard: typeof FormWizard
}

/** Renders a fully-validated form from a schema. `DynamicForm.Wizard` renders the multi-step variant. */
export const DynamicForm: DynamicFormType = Object.assign(DynamicFormComponent, { Wizard: FormWizard })
