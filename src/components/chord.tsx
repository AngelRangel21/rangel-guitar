'use client'

import type { ButtonHTMLAttributes } from 'react'
import { ChordDiagrams } from '@/components/chord-diagrams'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { useI18n } from '@/context/i18n-context'

/**
 * Componente que representa un único acorde en la hoja de acordes.
 * Es clickeable (y accesible con teclado) y muestra un popover con los
 * diagramas del acorde. La transposición ya viene hecha por @chordproject/parser.
 */
interface ChordProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string
}

export function Chord({ name, className = '', style, ...props }: ChordProps) {
  const { t } = useI18n()
  // La librería agrega role="button" y tabindex="0" al <span>; al usar un
  // <button> real esos atributos sobran.
  const {
    role: _role,
    tabIndex: _tabIndex,
    ...buttonProps
  } = props as ChordProps & { role?: string }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type='button'
          className={`font-bold text-accent cursor-pointer relative hover:underline z-10 text-left ${className}`}
          style={style}
          aria-label={`${t('chord')} ${name}`}
          {...buttonProps}
        >
          {name}
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-80' sideOffset={5}>
        <ChordDiagrams chordName={name} />
      </PopoverContent>
    </Popover>
  )
}
