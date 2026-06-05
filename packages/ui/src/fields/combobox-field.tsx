import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller } from 'react-hook-form'
import type { ComboboxFieldSpec, EnumOption } from '@rogeroliveira84/react-dynamic-forms'
import { Popover, PopoverContent, PopoverTrigger } from '../primitives/popover'
import { Input } from '../primitives/input'
import { FieldWrapper } from './field-wrapper'
import { useFieldState } from './use-field-state'
import { useRdfConfig } from './rdf-config'
import { cn } from '../utils/cn'

type Loader = (query: string) => Promise<EnumOption[]>

type ControlProps = {
  id: string
  placeholder: string
  staticOptions: EnumOption[] | undefined
  loader: Loader | undefined
  value: unknown
  onChange: (value: unknown) => void
  onBlur: () => void
}

function ComboboxControl({ id, placeholder, staticOptions, loader, value, onChange, onBlur }: ControlProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [asyncItems, setAsyncItems] = useState<EnumOption[]>([])
  const [loading, setLoading] = useState(false)
  const [labelCache, setLabelCache] = useState<Record<string, string>>({})
  const [active, setActive] = useState(0)
  const requestId = useRef(0)

  useEffect(() => {
    if (!loader || !open) return
    const id = ++requestId.current
    setLoading(true)
    const timer = setTimeout(() => {
      loader(query)
        .then((res) => {
          if (id !== requestId.current) return
          setAsyncItems(res)
          setLabelCache((cache) => {
            const next = { ...cache }
            for (const o of res) next[String(o.value)] = o.label
            return next
          })
        })
        .finally(() => {
          if (id === requestId.current) setLoading(false)
        })
    }, 200)
    return () => clearTimeout(timer)
  }, [query, loader, open])

  const items: EnumOption[] = useMemo(() => {
    if (loader) return asyncItems
    const all = staticOptions ?? []
    if (!query) return all
    return all.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
  }, [loader, asyncItems, staticOptions, query])

  const selectedLabel =
    value === undefined || value === null || value === ''
      ? undefined
      : (staticOptions?.find((o) => o.value === value)?.label ?? labelCache[String(value)] ?? String(value))

  const choose = (opt: EnumOption) => {
    onChange(opt.value)
    setLabelCache((cache) => ({ ...cache, [String(opt.value)]: opt.label }))
    setOpen(false)
    setQuery('')
    onBlur()
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) onBlur()
      }}
    >
      <PopoverTrigger
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          !selectedLabel && 'text-muted-foreground',
        )}
      >
        <span className="truncate">{selectedLabel ?? placeholder}</span>
      </PopoverTrigger>
      <PopoverContent>
        <Input
          autoFocus
          placeholder="Search…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActive((a) => Math.min(a + 1, items.length - 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActive((a) => Math.max(a - 1, 0))
            } else if (e.key === 'Enter') {
              e.preventDefault()
              const opt = items[active]
              if (opt) choose(opt)
            } else if (e.key === 'Escape') {
              setOpen(false)
            }
          }}
          className="mb-1 h-9"
        />
        <ul role="listbox" className="max-h-56 overflow-auto">
          {loading && <li className="px-2 py-1.5 text-sm text-muted-foreground">Loading…</li>}
          {!loading && items.length === 0 && (
            <li className="px-2 py-1.5 text-sm text-muted-foreground">No results</li>
          )}
          {items.map((opt, i) => (
            <li
              key={String(opt.value)}
              role="option"
              aria-selected={opt.value === value}
              className={cn(
                'cursor-pointer rounded-sm px-2 py-1.5 text-sm',
                i === active && 'bg-muted',
              )}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault()
                choose(opt)
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}

export function ComboboxField({ field }: { field: ComboboxFieldSpec }) {
  const { control, wrapperProps } = useFieldState(field)
  const config = useRdfConfig()
  const loader = config.asyncOptions?.[field.name]
  return (
    <FieldWrapper {...wrapperProps}>
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhf }) => (
          <ComboboxControl
            id={field.name}
            placeholder={field.placeholder ?? 'Select…'}
            staticOptions={field.options}
            loader={loader}
            value={rhf.value}
            onChange={rhf.onChange}
            onBlur={rhf.onBlur}
          />
        )}
      />
    </FieldWrapper>
  )
}
