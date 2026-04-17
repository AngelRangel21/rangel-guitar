'use client'

import { LayoutGrid, List } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Fragment, type JSX, useEffect, useMemo, useState } from 'react'
import { SongCard } from '@/components/song-card'
import { SongListItem } from '@/components/song-list-item'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import type { SongWithArtist } from '@/types/app.types'

// Constante para el número de canciones a mostrar por página.
const SONGS_PER_PAGE = 16

/**
 * Componente que muestra una lista de canciones con opciones de vista (cuadrícula/lista) y paginación.
 * @param {{ songs: Song[] }} props - Propiedades del componente, contiene la lista de canciones.
 * @returns {JSX.Element} El componente de la lista de canciones.
 */
export function SongList({ songs }: { songs: SongWithArtist[] }): JSX.Element {
  const [view, setView] = useState<'grid' | 'list'>('list')
  const [currentPage, setCurrentPage] = useState(1)
  const t = useTranslations('songList')

  // Efecto para resetear la paginación a la página 1 cada vez que la lista de canciones cambia (ej. por una búsqueda).
  useEffect(() => {
    setCurrentPage(1)
  }, [])

  const totalPages = Math.ceil(songs.length / SONGS_PER_PAGE)

  // `useMemo` para calcular las canciones de la página actual solo cuando sea necesario.
  const currentSongs = useMemo(() => {
    const start = (currentPage - 1) * SONGS_PER_PAGE
    const end = start + SONGS_PER_PAGE
    return songs.slice(start, end)
  }, [currentPage, songs])

  /**
   * Maneja el cambio de página.
   * @param {number} page - El número de página al que se quiere ir.
   */
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  /**
   * Renderiza los controles de paginación.
   * @returns {JSX.Element} El componente de paginación.
   */
  const renderPagination = () => {
    const pageNumbers = []
    const maxPagesToShow = 3
    const halfMaxPages = Math.floor(maxPagesToShow / 2)

    let startPage = Math.max(2, currentPage - halfMaxPages)
    let endPage = Math.min(totalPages - 1, currentPage + halfMaxPages)

    if (currentPage <= maxPagesToShow) {
      startPage = 2
      endPage = Math.min(totalPages - 1, maxPagesToShow)
    }

    if (currentPage > totalPages - maxPagesToShow) {
      startPage = Math.max(2, totalPages - maxPagesToShow)
      endPage = totalPages - 1
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              isActive={currentPage === 1}
              onClick={() => handlePageChange(1)}
            >
              1
            </PaginationLink>
          </PaginationItem>

          {startPage > 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {pageNumbers.map((number) => (
            <PaginationItem key={number}>
              <PaginationLink
                isActive={currentPage === number}
                onClick={() => handlePageChange(number)}
              >
                {number}
              </PaginationLink>
            </PaginationItem>
          ))}

          {endPage < totalPages - 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {totalPages > 1 && (
            <PaginationItem>
              <PaginationLink
                isActive={currentPage === totalPages}
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Controles para cambiar la vista */}
      <section className='flex justify-end items-center'>
        <nav className='flex items-center gap-2'>
          <Button
            variant={view === 'list' ? 'secondary' : 'ghost'}
            size='icon'
            onClick={() => setView('list')}
            aria-label={t('list.listView')}
          >
            <List className='h-5 w-5' />
          </Button>
          <Button
            variant={view === 'grid' ? 'secondary' : 'ghost'}
            size='icon'
            onClick={() => setView('grid')}
            aria-label={t('grid.gridView')}
          >
            <LayoutGrid className='h-5 w-5' />
          </Button>
        </nav>
      </section>

      {songs.length === 0 ? (
        // Mensaje si no se encuentran canciones (ej. después de una búsqueda).
        <div className='text-center py-16'>
          <p className='text-muted-foreground'>{t('noSongsFound')}</p>
        </div>
      ) : (
        <>
          {/* Contenedor que cambia entre cuadrícula y lista */}
          <div
            className={`transition-all duration-300 ${
              view === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6'
                : 'flex flex-col space-y-3'
            }`}
          >
            {currentSongs.map((song) => (
              <Fragment key={song.id}>
                {view === 'grid' ? (
                  <SongCard song={song} />
                ) : (
                  <SongListItem song={song} />
                )}
              </Fragment>
            ))}
          </div>

          {/* Muestra la paginación si hay más de una página. */}
          {totalPages > 1 && <div className='pt-6'>{renderPagination()}</div>}
        </>
      )}
    </div>
  )
}
