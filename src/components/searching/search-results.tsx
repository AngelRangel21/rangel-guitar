'use client'

import { Link } from '@/i18n/navigation'
import type { SearchSong } from './search.types'
import { HighlightMatch, SongCover } from './search-visuals'

interface SearchResultsProps {
  songs: SearchSong[]
  query: string
}

/** Grid de resultados de la página de búsqueda. */
export function SearchResults({ songs, query }: SearchResultsProps) {
  return (
    <ul className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
      {songs.map((song) => (
        <li key={song.id}>
          <Link
            href={{ pathname: '/songs/[slug]', params: { slug: song.slug } }}
            className='flex h-full items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-accent/40 hover:bg-accent/40'
          >
            <SongCover src={song.coverArt} alt={song.title} size='md' />

            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-semibold text-foreground leading-snug'>
                <HighlightMatch text={song.title} query={query} />
              </p>
              <p className='truncate text-xs text-muted-foreground leading-snug'>
                <HighlightMatch text={song.artist} query={query} />
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
