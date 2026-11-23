import type { JSX } from 'react'
import { SongCard } from '@/components/song-card'
import { SongListItem } from '@/components/song-list-item'
import type { SongWithArtist } from '@/types/app.types'
import type { SongListView } from './song-list.types'

interface SongListItemsProps {
  songs: SongWithArtist[]
  view: SongListView
  /** Índice (0-based) de la primera canción, para numerar la lista. */
  offset: number
}

/** Canciones de la página actual, en cuadrícula o en lista numerada. */
export function SongListItems({
  songs,
  view,
  offset
}: SongListItemsProps): JSX.Element {
  if (view === 'grid') {
    return (
      <ul className='grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4'>
        {songs.map((song) => (
          <li key={song.id}>
            <SongCard song={song} />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ol className='flex flex-col divide-y divide-border/60'>
      {songs.map((song, index) => (
        <li key={song.id} className='py-1'>
          <SongListItem song={song} position={offset + index + 1} />
        </li>
      ))}
    </ol>
  )
}
