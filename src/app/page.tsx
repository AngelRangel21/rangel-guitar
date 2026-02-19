/* eslint-disable react/react-in-jsx-scope */
import { HomeClient } from '@/components/home-client'
import { getSongs } from '@/services/song.service'
import type { Song } from '@/types'
import { Metadata } from 'next'
import { JSX } from 'react'

export const metadata: Metadata = {
  title: 'Rangel Guitar - Aprende Guitarra con Tablaturas y Acordes',
  description:
    'La mejor colección de tablaturas y acordes de guitarra. Encuentra canciones de tus artistas favoritos y aprende a tocar hoy mismo.',
  alternates: {
    canonical: 'https://rangelguitar.com'
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Rangel Guitar',
  url: 'https://rangelguitar.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://rangelguitar.com/search?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  }
}

/**
 * Componente de página principal del servidor.
 * Esta página se renderiza en el servidor y es responsable de obtener los datos iniciales de las canciones.
 * @returns {Promise<JSX.Element>} El componente HomeClient con los datos iniciales de las canciones.
 */
export default async function Home (): Promise<JSX.Element> {
  // Inicializa un array para almacenar todas las canciones.
  let allSongs: Song[] = []
  let error: Error | null = null

  try {
    allSongs = await getSongs()
  } catch (err) {
    error = err instanceof Error ? err : new Error('Unknown error')

    // ✅ Log detallado en el servidor
    console.error('='.repeat(60))
    console.error('🔴 ERROR AL CARGAR CANCIONES')
    console.error('Timestamp:', new Date().toISOString())
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
    console.error('='.repeat(60))
  }

  // ✅ Si hay error CRÍTICO (no conexión a BD), mostrar página de error
  if ((error != null) && allSongs.length === 0) {
    return (
      <div className='min-h-screen flex items-center justify-center px-4'>
        <div className='max-w-md text-center space-y-4'>
          <h1 className='text-2xl font-bold text-destructive'>
            Error al cargar canciones
          </h1>
          <p className='text-muted-foreground'>
            No pudimos conectar con la base de datos. Por favor intenta más tarde.
          </p>
          <p className='text-sm text-muted-foreground/60'>
            {error.message}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient initialSongs={allSongs} />
    </>
  )
}
