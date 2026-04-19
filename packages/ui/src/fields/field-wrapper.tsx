import * as React from 'react'
import { Label } from '../primitives/label'
import { cn } from '../utils/cn'

export type FieldWrapperProps = {
  id: string
  label?: string
  description?: string
  required?: boolean
  error?: string
  children: React.ReactNode
  className?: string
  layout?: 'label-top' | 'label-inline'
}

export function FieldWrapper({
  id,
  label,
  description,
  required,
  error,
  children,
  className,
  layout = 'label-top',
}: FieldWrapperProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5',
        layout === 'label-inline' && 'flex-row items-center gap-3',
        className,
      )}
    >
      {label && (
        <Label htmlFor={id} className={cn(error && 'text-destructive')}>
          {label}
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-destructive">
              *
            </span>
          )}
        </Label>
      )}
      <div className="flex flex-col gap-1">
        {children}
        {description && !error && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {error && (
          <p className="text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
