'use client'

import { useState, useMemo, useEffect, Fragment, JSX } from 'react'
import { LayoutGrid, List } from 'lucide-react'
import type { SongWithArtist } from '@/types/app.types'
import { SongCard } from '@/components/song-card'
import { SongListItem } from '@/components/song-list-item'
import { useI18n } from '@/context/i18n-context'

// Constante para el número de canciones a mostrar por página.
const SONGS_PER_PAGE = 16

/**
 * Componente que muestra una lista de canciones con opciones de vista (cuadrícula/lista) y paginación.
 * @param {{ songs: Song[] }} props - Propiedades del componente, contiene la lista de canciones.
 * @returns {JSX.Element} El componente de la lista de canciones.
 */
export function SongList ({ songs }: { songs: SongWithArtist[] }): JSX.Element {
  const [view, setView] = useState<'grid' | 'list'>('list')
  const [currentPage, setCurrentPage] = useState(1)
  const { t } = useI18n()

  // Efecto para resetear la paginación a la página 1 cada vez que la lista de canciones cambia (ej. por una búsqueda).
  useEffect(() => {
    setCurrentPage(1)
  }, [songs])

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

  return (
    <div className='space-y-2' style={{ fontFamily: "'Tahoma', 'MS Sans Serif', sans-serif" }}>
      {/* View Toggle toolbar */}
      <section className='flex justify-between items-center pb-1' style={{ borderBottom: '1px solid #808080' }}>
        <span style={{ fontSize: '10px', color: '#444' }}>{songs.length} canciones</span>
        <nav className='flex items-center gap-1'>
          <button
            className='win-button'
            style={{ padding: '1px 5px', background: view === 'list' ? '#a0a0a0' : '#d4d0c8' }}
            onClick={() => setView('list')}
            aria-label={t('listView')}
            title='Vista lista'
          >
            <List className='h-3 w-3' />
          </button>
          <button
            className='win-button'
            style={{ padding: '1px 5px', background: view === 'grid' ? '#a0a0a0' : '#d4d0c8' }}
            onClick={() => setView('grid')}
            aria-label={t('gridView')}
            title='Vista cuadrícula'
          >
            <LayoutGrid className='h-3 w-3' />
          </button>
        </nav>
      </section>

      {songs.length === 0 ? (
        <div className='win-inset p-4 text-center'>
          <p style={{ fontSize: '11px' }}>{t('noSongsFound')}</p>
        </div>
      ) : (
        <>
          {/* Song list/grid — with alternating row colors in list view */}
          <div
            className={view === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'
              : 'win-inset'
            }
          >
            {currentSongs.map((song, idx) => (
              <Fragment key={song.id}>
                {view === 'grid'
                  ? <SongCard song={song} />
                  : (
                    <div style={{ background: idx % 2 === 0 ? '#ffffff' : '#f0f0f0' }}>
                      <SongListItem song={song} />
                    </div>
                    )}
              </Fragment>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='flex justify-center items-center gap-1 pt-2'>
              <button
                className='win-button'
                style={{ fontSize: '10px', padding: '1px 6px' }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt; Ant
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className='win-button'
                  style={{
                    fontSize: '10px',
                    padding: '1px 6px',
                    fontWeight: currentPage === page ? 'bold' : 'normal',
                    background: currentPage === page ? '#a0a0a0' : '#d4d0c8'
                  }}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className='win-button'
                style={{ fontSize: '10px', padding: '1px 6px' }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sig &gt;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
