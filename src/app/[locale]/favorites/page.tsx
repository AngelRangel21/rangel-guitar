'use client'

import { Heart } from 'lucide-react'
import { type JSX, useEffect, useState } from 'react'
import { useAuthStore } from '@/auth/stores/auth.stores'
import { ProtectedPage } from '@/components/protected-page'
import { SongList } from '@/components/song-list'
import { Skeleton } from '@/components/ui/skeleton'
import { useI18n } from '@/context/i18n-context'
import { supabase } from '@/lib/supabase'
import type { SongWithArtist } from '@/types/app.types'

function FavoritesContent(): JSX.Element {
  const { t } = useI18n()
  const user = useAuthStore((s) => s.user)
  const favoritesIds = useAuthStore((s) => s.favoriteIds)
  const isInitialized = useAuthStore((s) => s.isInitialized)

  const [favoriteSongs, setFavoriteSongs] = useState<SongWithArtist[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isInitialized || user == null) return
    if (favoritesIds.size === 0) {
      setFavoriteSongs([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    supabase
      .from('songs')
      .select('*, artists:songs_artists(artist:artists(id, name, slug))')
      .in('id', Array.from(favoritesIds))
      .eq('isPublished', true)
      .then(({ data, error }) => {
        if (error != null) {
          console.error('Error loading favorite songs: ', error)
        } else {
          const formatted = data?.map((song) => ({
            ...song,
            // biome-ignore lint/suspicious/noExplicitAny: explain
            artists: song.artists.map((a: any) => a.artist)
          }))
          setFavoriteSongs(formatted || [])
        }
        setIsLoading(false)
      })
  }, [favoritesIds, isInitialized, user]) // Se vuelve a ejecutar si la lista de favoritos o el estado de carga cambian.

  // Muestra un esqueleto de carga mientras se obtienen los datos.
  if (!isInitialized || isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center gap-4'>
          <Skeleton className='h-9 w-48' />
        </div>
        <div className='flex flex-col space-y-3'>
          <Skeleton className='h-14 w-full' />
          <Skeleton className='h-14 w-full' />
          <Skeleton className='h-14 w-full' />
        </div>
      </div>
    )
  }

  // Renderiza el contenido principal de la página.
  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <h1 className='text-3xl font-bold text-foreground'>
          {t('myFavorites')}
        </h1>
      </div>
      {/* Muestra la lista de canciones si hay favoritas, o un mensaje si no las hay. */}
      {favoriteSongs.length > 0 ? (
        <SongList songs={favoriteSongs} />
      ) : (
        <div className='text-center py-16 border-2 border-dashed rounded-lg'>
          <Heart className='mx-auto h-12 w-12 text-muted-foreground' />
          <p className='mt-4 text-muted-foreground'>{t('noFavorites')}</p>
        </div>
      )}
    </div>
  )
}

/**
 * Página principal de "Favoritos".
 * Esta página está protegida y solo es accesible para usuarios autenticados.
 * @returns {JSX.Element} La página de favoritos.
 */
export default function FavoritesPage(): JSX.Element {
  return (
    // Componente que protege la página, requiriendo autenticación.
    <ProtectedPage>
      <div className='flex flex-col min-h-screen bg-background'>
        <main className='grow container mx-auto px-4 py-8 space-y-6 opacity-0 animate-content-in'>
          {/* El contenido se maneja en un componente separado. */}
          <FavoritesContent />
        </main>
      </div>
    </ProtectedPage>
  )
}
