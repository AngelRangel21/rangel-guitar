'use client'

import { Mic2, Search, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type JSX, useId, useMemo, useState } from 'react'
import { ArtistCard } from '@/components/artist-card'
import type { ArtistCount } from '@/types/app.types'

/** Quita acentos y pasa a minúsculas para comparar nombres. */
function normalize(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/** Cuadrícula de artistas con filtro por nombre. */
export function ArtistList({
  artists
}: {
  artists: ArtistCount[]
}): JSX.Element {
  const t = useTranslations('artistsPage')
  const inputId = useId()
  const [filter, setFilter] = useState('')

  const sortedArtists = useMemo(
    () =>
      [...artists].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
      ),
    [artists]
  )

  const term = normalize(filter.trim())
  const visibleArtists = term
    ? sortedArtists.filter((artist) => normalize(artist.name).includes(term))
    : sortedArtists

  return (
    <section aria-label={t('listLabel')} className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-3 border-b pb-4'>
        <p className='text-sm text-muted-foreground' aria-live='polite'>
          {t('artistCount', { count: visibleArtists.length })}
        </p>

        <div className='relative w-full sm:w-72'>
          <label htmlFor={inputId} className='sr-only'>
            {t('filterLabel')}
          </label>
          <Search
            aria-hidden='true'
            className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground'
          />
          <input
            id={inputId}
            type='search'
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder={t('filterPlaceholder')}
            autoComplete='off'
            className='h-10 w-full rounded-full border border-input bg-background pl-9 pr-9 text-sm placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring [&::-webkit-search-cancel-button]:hidden'
          />
          {filter !== '' && (
            <button
              type='button'
              onClick={() => setFilter('')}
              aria-label={t('clearFilter')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground'
            >
              <X className='size-4' />
            </button>
          )}
        </div>
      </div>

      {visibleArtists.length === 0 ? (
        <div className='flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center'>
          <Mic2
            aria-hidden='true'
            className='size-10 text-muted-foreground/40'
          />
          <p className='text-muted-foreground'>
            {t('noResults', { term: filter.trim() })}
          </p>
        </div>
      ) : (
        <ul className='grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6'>
          {visibleArtists.map((artist) => (
            <li key={artist.id}>
              <ArtistCard artist={artist} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
