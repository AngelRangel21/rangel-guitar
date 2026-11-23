'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { ChordCard } from '@/components/chord-card'
import { SegmentedControl } from '@/components/layout/segmented-control'
import { useI18n } from '@/context/i18n-context'

interface ChordsListProps {
  majorChords: string[]
  minorChords: string[]
  seventhChords: string[]
}

type ChordFilter = 'all' | 'major' | 'minor' | 'seventh'

/** Acordes agrupados por tipo, con un filtro para ver solo un grupo. */
export function ChordsList({
  majorChords,
  minorChords,
  seventhChords
}: ChordsListProps) {
  const { t } = useI18n()
  const tc = useTranslations('chordsPage')
  const [filter, setFilter] = useState<ChordFilter>('all')

  const groups = [
    { id: 'major', title: t('majorChords'), chords: majorChords },
    { id: 'minor', title: t('minorChords'), chords: minorChords },
    { id: 'seventh', title: t('seventhChords'), chords: seventhChords }
  ] as const

  const visibleGroups =
    filter === 'all' ? groups : groups.filter((g) => g.id === filter)

  return (
    <div className='space-y-10'>
      <div className='flex flex-wrap items-center justify-between gap-3 border-b pb-4'>
        <p className='text-sm text-muted-foreground'>{tc('hint')}</p>
        <div className='max-w-full overflow-x-auto'>
          <SegmentedControl<ChordFilter>
            label={tc('filterLabel')}
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: tc('all') },
              { value: 'major', label: tc('major') },
              { value: 'minor', label: tc('minor') },
              { value: 'seventh', label: tc('seventh') }
            ]}
          />
        </div>
      </div>

      {visibleGroups.map((group) => (
        <section
          key={group.id}
          aria-labelledby={`chords-${group.id}`}
          className='space-y-4'
        >
          <div className='flex items-baseline justify-between gap-4'>
            <h2
              id={`chords-${group.id}`}
              className='text-2xl font-bold tracking-tight text-foreground font-headline'
            >
              {group.title}
            </h2>
            <span className='text-sm text-muted-foreground'>
              {tc('count', { count: group.chords.length })}
            </span>
          </div>
          <ul className='grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-3 md:grid-cols-8 lg:grid-cols-12'>
            {group.chords.map((chord) => (
              <li key={chord}>
                <ChordCard chordName={chord} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
