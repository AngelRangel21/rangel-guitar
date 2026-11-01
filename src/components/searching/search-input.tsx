'use client'

import { Search, X } from 'lucide-react'
import type { KeyboardEvent, RefObject } from 'react'
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
}

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
  combobox
}: SearchInputProps) {
  return (
    <div
      ref={containerRef}
      className={`relative flex items-center ${className}`}
    >
      <Search className='absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none' />

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
        className='w-full h-10 pl-9 pr-9 text-sm bg-background border border-input rounded-lg
          placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
          transition-shadow'
        autoComplete='off'
        spellCheck={false}
        enterKeyHint='search'
        // biome-ignore lint/a11y/noAutofocus: el buscador es la acción principal de la página
        autoFocus={autoFocus}
      />

      {isLoading ? (
        <Spinner className='absolute right-3 w-4 h-4' />
      ) : value && onClear != null ? (
        <button
          type='button'
          onClick={onClear}
          aria-label={clearLabel}
          className='absolute right-3 text-muted-foreground hover:text-foreground transition-colors'
        >
          <X className='w-4 h-4' />
        </button>
      ) : null}
    </div>
  )
}
