'use client'

import { ChevronRight } from 'lucide-react'
import { SongArtwork } from '@/components/song-artwork'
import { Link } from '@/i18n/navigation'
import type { SearchSong } from './search.types'
import { HighlightMatch } from './search-visuals'

interface SearchResultsProps {
  songs: SearchSong[]
  query: string
}

/** Resultados de la página de búsqueda. */
export function SearchResults({ songs, query }: SearchResultsProps) {
  return (
    <ul className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
      {songs.map((song) => (
        <li key={song.id}>
          <Link
            href={{ pathname: '/songs/[slug]', params: { slug: song.slug } }}
            className='group flex h-full items-center gap-3 rounded-2xl border bg-card p-2.5 pr-4 transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          >
            <SongArtwork
              src={song.coverArt}
              alt=''
              sizes='112px'
              className='aspect-video w-28 shrink-0 rounded-xl'
            />

            <div className='min-w-0 flex-1'>
              <p className='truncate font-semibold text-foreground leading-snug'>
                <HighlightMatch text={song.title} query={query} />
              </p>
              <p className='truncate text-sm text-muted-foreground leading-snug'>
                <HighlightMatch text={song.artist} query={query} />
              </p>
            </div>

            <ChevronRight
              aria-hidden='true'
              className='size-5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground'
            />
          </Link>
        </li>
      ))}
    </ul>
  )
}
