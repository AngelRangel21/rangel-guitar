'use client'

import { ChordDiagrams } from '@/components/chord-diagrams'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { useI18n } from '@/context/i18n-context'

/** Separa la nota raíz (C, C#, Db…) del resto del acorde (m, 7, maj7…). */
function splitChord(name: string): [string, string] {
  const match = /^([A-G][#b]?)(.*)$/.exec(name)
  return match ? [match[1], match[2]] : [name, '']
}

/**
 * Ficha de un acorde. Al pulsarla abre un popover con sus diagramas de
 * guitarra y teclado.
 */
export function ChordCard({ chordName }: { chordName: string }) {
  const { t } = useI18n()
  const [root, suffix] = splitChord(chordName)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type='button'
          aria-label={`${t('chord')} ${chordName}`}
          className='group flex aspect-square w-full items-center justify-center rounded-2xl border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:border-foreground data-[state=open]:bg-primary data-[state=open]:text-primary-foreground'
        >
          <span className='text-2xl font-bold tracking-tight sm:text-3xl'>
            {root}
            {suffix !== '' && (
              <span className='text-base font-semibold text-muted-foreground group-data-[state=open]:text-primary-foreground/70 sm:text-lg'>
                {suffix}
              </span>
            )}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-80 rounded-2xl'>
        <ChordDiagrams chordName={chordName} />
      </PopoverContent>
    </Popover>
  )
}
