import { useEffect, useMemo, useState } from 'react'
import { FormProvider, type FieldValues, type SubmitHandler, type DefaultValues } from 'react-hook-form'
import {
  useDynamicForm,
  type SchemaInput,
  type RdfLocaleInput,
  type RdfMessages,
} from '@rogeroliveira84/react-dynamic-forms'
import { Button } from './primitives/button'
import { FieldResolver } from './fields/field-resolver'
import { RdfConfigProvider, type AsyncOptionsMap } from './fields/rdf-config'
import { cn } from './utils/cn'

export type WizardStep = {
  title?: string
  description?: string
  fields: string[]
}

export type FormWizardProps<TValues extends FieldValues = FieldValues> = {
  schema: SchemaInput
  steps: WizardStep[]
  onSubmit: SubmitHandler<TValues>
  defaultValues?: DefaultValues<TValues>
  onStepChange?: (index: number) => void
  labels?: { next?: string; back?: string; submit?: string }
  locale?: RdfLocaleInput
  messages?: RdfMessages
  asyncOptions?: AsyncOptionsMap
  className?: string
}

export function FormWizard<TValues extends FieldValues = FieldValues>(props: FormWizardProps<TValues>) {
  const { form, internalSchema } = useDynamicForm<TValues>({
    schema: props.schema,
    defaultValues: props.defaultValues,
    locale: props.locale,
    messages: props.messages,
  })
  const [step, setStep] = useState(0)

  const fieldsByName = useMemo(
    () => new Map(internalSchema.fields.map((f) => [f.name, f])),
    [internalSchema],
  )

  // Guard: every schema field should live in some step, or it silently blocks submit.
  useEffect(() => {
    const covered = new Set(props.steps.flatMap((s) => s.fields))
    const missing = internalSchema.fields.map((f) => f.name).filter((n) => !covered.has(n))
    if (missing.length > 0) {
      console.warn(
        `[react-dynamic-forms] <DynamicForm.Wizard>: these fields are not in any step and will block submit: ${missing.join(', ')}`,
      )
    }
  }, [props.steps, internalSchema])

  const current = props.steps[step]
  const isLast = step === props.steps.length - 1
  const stepFields = (current?.fields ?? [])
    .map((name) => fieldsByName.get(name))
    .filter((f): f is NonNullable<typeof f> => Boolean(f))

  const changeStep = (next: number) => {
    setStep(next)
    props.onStepChange?.(next)
  }

  const goNext = async () => {
    const names = current?.fields ?? []
    const ok = await form.trigger(names as Parameters<typeof form.trigger>[0])
    if (ok) changeStep(Math.min(step + 1, props.steps.length - 1))
  }

  return (
    <RdfConfigProvider value={{ asyncOptions: props.asyncOptions }}>
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(props.onSubmit)}
        className={cn('flex flex-col gap-4', props.className)}
        noValidate
      >
        <div
          className="flex items-center gap-1.5"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={props.steps.length}
          aria-label={`Step ${step + 1} of ${props.steps.length}`}
        >
          {props.steps.map((s, i) => (
            <div
              key={s.title ?? i}
              className={cn('h-1.5 flex-1 rounded-full', i <= step ? 'bg-primary' : 'bg-muted')}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Step {step + 1} of {props.steps.length}
        </p>

        {current?.title && <h2 className="text-lg font-semibold">{current.title}</h2>}
        {current?.description && (
          <p className="text-sm text-muted-foreground">{current.description}</p>
        )}

        {stepFields.map((f) => (
          <FieldResolver key={f.name} field={f} />
        ))}

        <div className="mt-2 flex justify-between">
          <Button type="button" variant="outline" onClick={() => changeStep(Math.max(step - 1, 0))} disabled={step === 0}>
            {props.labels?.back ?? 'Back'}
          </Button>
          {isLast ? (
            <Button type="submit">{props.labels?.submit ?? 'Submit'}</Button>
          ) : (
            <Button type="button" onClick={goNext}>
              {props.labels?.next ?? 'Next'}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
    </RdfConfigProvider>
  )
}
