import type { FileFieldSpec } from '@rogeroliveira84/react-dynamic-forms'
import { Controller } from 'react-hook-form'
import { Button } from '../primitives/button'
import { Input } from '../primitives/input'
import { FieldWrapper } from './field-wrapper'
import { useFieldState } from './use-field-state'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileField({ field }: { field: FileFieldSpec }) {
  const { control, wrapperProps } = useFieldState(field)
  return (
    <FieldWrapper {...wrapperProps}>
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhf }) => {
          const value = rhf.value as File | File[] | undefined
          const files: File[] = Array.isArray(value) ? value : value instanceof File ? [value] : []
          return (
            <div className="flex flex-col gap-2">
              <Input
                id={field.name}
                type="file"
                accept={field.accept}
                multiple={field.multiple}
                onChange={(e) => {
                  const picked = Array.from(e.target.files ?? [])
                  rhf.onChange(field.multiple ? picked : (picked[0] ?? null))
                }}
                className="file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
              />
              {files.length > 0 && (
                <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
                  {files.map((f, i) => (
                    <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-2">
                      <span className="truncate">
                        {f.name} · {formatBytes(f.size)}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (field.multiple) {
                            const next = files.filter((_, j) => j !== i)
                            rhf.onChange(next)
                          } else {
                            rhf.onChange(null)
                          }
                        }}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        }}
      />
    </FieldWrapper>
  )
}
