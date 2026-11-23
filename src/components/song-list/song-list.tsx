'use client'

import { type JSX, useMemo, useRef, useState } from 'react'
import type { SongWithArtist } from '@/types/app.types'
import type { SongListSort, SongListView } from './song-list.types'
import { getTotalPages, SONGS_PER_PAGE, sortSongs } from './song-list.utils'
import { SongListEmpty } from './song-list-empty'
import { SongListItems } from './song-list-items'
import { SongListPagination } from './song-list-pagination'
import { SongListToolbar } from './song-list-toolbar'

interface SongListProps {
  songs: SongWithArtist[]
}

/**
 * Lista de canciones con opciones de vista (cuadrícula/lista), orden y
 * paginación. Solo guarda el estado; cada parte se pinta en su componente.
 */
export function SongList({ songs }: SongListProps): JSX.Element {
  const [view, setView] = useState<SongListView>('list')
  const [sort, setSort] = useState<SongListSort>('recent')
  const [requestedPage, setRequestedPage] = useState(1)
  const topRef = useRef<HTMLDivElement>(null)

  const sortedSongs = useMemo(() => sortSongs(songs, sort), [songs, sort])

  const totalPages = getTotalPages(songs.length)
  // Si la lista cambia y se queda con menos páginas, no nos salimos del rango.
  const currentPage = Math.min(requestedPage, totalPages)
  const pageOffset = (currentPage - 1) * SONGS_PER_PAGE

  const currentSongs = useMemo(
    () => sortedSongs.slice(pageOffset, pageOffset + SONGS_PER_PAGE),
    [sortedSongs, pageOffset]
  )

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    setRequestedPage(page)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSortChange = (value: SongListSort) => {
    setSort(value)
    setRequestedPage(1)
  }

  if (songs.length === 0) return <SongListEmpty />

  return (
    <div ref={topRef} className='scroll-mt-24 space-y-4'>
      <SongListToolbar
        total={songs.length}
        rangeStart={pageOffset + 1}
        rangeEnd={pageOffset + currentSongs.length}
        hasMultiplePages={totalPages > 1}
        sort={sort}
        onSortChange={handleSortChange}
        view={view}
        onViewChange={setView}
      />

      <SongListItems songs={currentSongs} view={view} offset={pageOffset} />

      {totalPages > 1 && (
        <div className='pt-4'>
          <SongListPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}
