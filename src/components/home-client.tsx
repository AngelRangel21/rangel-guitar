'use client'

import { useTranslations } from 'next-intl'
import type { JSX } from 'react'
import { SongList } from '@/components/song-list'
import type { SongWithArtist } from '@/types/app.types'
import { SongSearch } from './search'

/**
 * Componente de cliente para la página de inicio.
 * Recibe la lista inicial de canciones desde el servidor y maneja la lógica de búsqueda del lado del cliente.
 * @param {{ initialSongs: Song[] }} props - Propiedades que contienen la lista inicial de canciones.
 * @returns {JSX.Element} El componente de la página de inicio.
 */
export function HomeClient({
  initialSongs
}: {
  initialSongs: SongWithArtist[]
}): JSX.Element {
  const t = useTranslations('homeClient')

  return (
    <>
      {/* El encabezado recibe el término de búsqueda y la función para actualizarlo. */}
      <main className='grow container mx-auto px-4 py-8 space-y-6'>
        <SongSearch placeholder={t('search.placeholder')} />
        <div className='flex justify-between items-center'>
          <h2 className='text-3xl font-bold text-foreground'>
            {t('allSongs')}
          </h2>
        </div>
        {/* La lista de canciones recibe las canciones filtradas para renderizar. */}
        <SongList songs={initialSongs} />
      </main>
    </>
  )
}
