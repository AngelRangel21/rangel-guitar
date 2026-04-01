'use client'

import { SongList } from '@/components/song-list'
import type { SongWithArtist } from '@/types/app.types'
import { useI18n } from '@/context/i18n-context'
import { SongSearch } from './search'
import { JSX } from 'react'

/**
 * Componente de cliente para la página de inicio.
 * Recibe la lista inicial de canciones desde el servidor y maneja la lógica de búsqueda del lado del cliente.
 * @param {{ initialSongs: Song[] }} props - Propiedades que contienen la lista inicial de canciones.
 * @returns {JSX.Element} El componente de la página de inicio.
 */
export function HomeClient ({ initialSongs }: { initialSongs: SongWithArtist[] }): JSX.Element {
  const { t } = useI18n()

  return (
    <>
      <main className='grow container mx-auto px-2 py-3' style={{ fontFamily: "'Tahoma', 'MS Sans Serif', sans-serif" }}>
        {/* Win2K Window frame */}
        <div className='win-window mb-3'>
          {/* Window title bar */}
          <div className='win-title-bar'>
            <span style={{ fontSize: '11px' }}>🔍 Buscar Canciones</span>
          </div>
          {/* Window content */}
          <div className='p-2'>
            <SongSearch />
          </div>
        </div>

        {/* Songs panel */}
        <div className='win-window'>
          <div className='win-title-bar'>
            <span style={{ fontSize: '11px' }}>🎵 {t('allSongs')}</span>
          </div>
          <div className='p-2'>
            <SongList songs={initialSongs} />
          </div>
        </div>
      </main>
    </>
  )
}
