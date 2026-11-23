import type { JSX } from 'react'
import { cn } from '@/lib/utils'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
  icon?: JSX.Element
}

interface SegmentedControlProps<T extends string> {
  label: string
  value: T
  options: SegmentedOption<T>[]
  onChange: (value: T) => void
  /** Oculta el texto de cada opción y deja solo el icono. */
  iconOnly?: boolean
}

/** Grupo de botones excluyentes con estilo de "pastilla". */
export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  iconOnly = false
}: SegmentedControlProps<T>): JSX.Element {
  return (
    <fieldset className='inline-flex items-center gap-0.5 rounded-lg border bg-muted/50 p-0.5'>
      <legend className='sr-only'>{label}</legend>
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type='button'
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            aria-label={iconOnly ? option.label : undefined}
            title={iconOnly ? option.label : undefined}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {option.icon}
            {!iconOnly && <span>{option.label}</span>}
          </button>
        )
      })}
    </fieldset>
  )
}
