'use client'

import { Search, X } from 'lucide-react'
import type { KeyboardEvent, ReactNode, RefObject } from 'react'
import { Spinner } from '../ui/spinner'

interface SearchComboboxProps {
  expanded: boolean
  controls: string
  activeDescendant?: string
}

interface SearchInputProps {
  /** id del input, para asociarlo con el `<label>`. */
  id?: string
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
  onClear?: () => void
  placeholder?: string
  /** Texto accesible del input (se renderiza como `<label>` sr-only). */
  label?: string
  /** Texto accesible del botón de limpiar. */
  clearLabel?: string
  isLoading?: boolean
  inputRef?: RefObject<HTMLInputElement | null>
  containerRef?: RefObject<HTMLDivElement | null>
  className?: string
  autoFocus?: boolean
  /** Cuando se pasa, el input se comporta como combobox (dropdown). */
  combobox?: SearchComboboxProps
  /** Tamaño visual: `lg` es el buscador destacado de la home. */
  size?: 'md' | 'lg'
  /** Contenido extra a la derecha cuando el campo está vacío (p. ej. un atajo). */
  trailing?: ReactNode
}

const SIZE_STYLES = {
  md: {
    icon: 'left-3 w-4 h-4',
    input: 'h-10 pl-9 pr-9 text-sm rounded-lg',
    end: 'right-3 w-4 h-4'
  },
  lg: {
    icon: 'left-4 w-5 h-5',
    input: 'h-14 pl-12 pr-12 text-base rounded-2xl shadow-sm',
    end: 'right-4 w-5 h-5'
  }
} as const

/**
 * Input del buscador compartido por el dropdown de la home y por la página
 * de resultados: icono, campo, spinner y botón de limpiar.
 */
export function SearchInput({
  id,
  value,
  onChange,
  onFocus,
  onKeyDown,
  onClear,
  placeholder,
  label,
  clearLabel = 'Limpiar búsqueda',
  isLoading = false,
  inputRef,
  containerRef,
  className = '',
  autoFocus = false,
  combobox,
  size = 'md',
  trailing
}: SearchInputProps) {
  const styles = SIZE_STYLES[size]

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center ${className}`}
    >
      <Search
        aria-hidden='true'
        className={`absolute ${styles.icon} text-muted-foreground pointer-events-none`}
      />

      {label != null && (
        <label htmlFor={id} className='sr-only'>
          {label}
        </label>
      )}

      <input
        id={id}
        ref={inputRef}
        {...(combobox != null
          ? {
              role: 'combobox',
              'aria-expanded': combobox.expanded,
              'aria-autocomplete': 'list',
              'aria-haspopup': 'listbox',
              'aria-controls': combobox.controls,
              'aria-activedescendant': combobox.activeDescendant
            }
          : {})}
        type='text'
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={`w-full ${styles.input} bg-background border border-input
          placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
          transition-shadow`}
        autoComplete='off'
        spellCheck={false}
        enterKeyHint='search'
        // biome-ignore lint/a11y/noAutofocus: el buscador es la acción principal de la página
        autoFocus={autoFocus}
      />

      {isLoading ? (
        <Spinner className={`absolute ${styles.end}`} />
      ) : value && onClear != null ? (
        <button
          type='button'
          onClick={onClear}
          aria-label={clearLabel}
          className={`absolute ${size === 'lg' ? 'right-4' : 'right-3'} text-muted-foreground hover:text-foreground transition-colors`}
        >
          <X className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
        </button>
      ) : value === '' && trailing != null ? (
        <span
          aria-hidden='true'
          className='absolute right-4 pointer-events-none'
        >
          {trailing}
        </span>
      ) : null}
    </div>
  )
}
