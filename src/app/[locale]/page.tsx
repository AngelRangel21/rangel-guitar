import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { JSX } from 'react'
import { HomeClient } from '@/components/home-client'
import { getSongByArtist } from '@/services/song.service'
import type { SongWithArtist } from '@/types/app.types'

export default async function Home({
  params
}: PageProps<'/[locale]'>): Promise<JSX.Element> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('page')
  // Inicializa un array para almacenar todas las canciones.
  let allSongs: SongWithArtist[] = []
  let error: Error | null = null

  try {
    allSongs = await getSongByArtist()
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
  if (error != null && allSongs.length === 0) {
    return (
      <div className='min-h-screen flex items-center justify-center px-4'>
        <div className='max-w-md text-center space-y-4'>
          <h1 className='text-2xl font-bold text-destructive'>{t('error')}</h1>
          <p className='text-muted-foreground'>{t('errorDb')}</p>
          <p className='text-sm text-muted-foreground/60'>{error.message}</p>
        </div>
      </div>
    )
  }

  return <HomeClient initialSongs={allSongs} />
}
