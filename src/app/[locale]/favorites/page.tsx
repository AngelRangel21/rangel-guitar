'use client'

import { Heart, Music } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type JSX, useEffect, useState } from 'react'
import { useAuthStore } from '@/auth/stores/auth.stores'
import { EmptyState } from '@/components/layout/empty-state'
import { PageHeader, PageShell } from '@/components/layout/page-header'
import { ProtectedPage } from '@/components/protected-page'
import { SongList } from '@/components/song-list'
import { Skeleton } from '@/components/ui/skeleton'
import { useI18n } from '@/context/i18n-context'
import { Link } from '@/i18n/navigation'
import { getSongsByIds } from '@/services/song.service'
import type { SongWithArtist } from '@/types/app.types'

function FavoritesPageBody(): JSX.Element {
  const t = useTranslations('favoritesPage')

  return (
    <PageShell>
      <PageHeader
        eyebrow={{ icon: Heart, label: t('eyebrow') }}
        title={t('title')}
        description={t('description')}
      />
      <FavoritesContent />
    </PageShell>
  )
}

function FavoritesContent(): JSX.Element {
  const { t } = useI18n()
  const tp = useTranslations('favoritesPage')
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

    getSongsByIds(Array.from(favoritesIds))
      .then(setFavoriteSongs)
      .catch((error: unknown) => {
        console.error('Error loading favorite songs: ', error)
      })
      .finally(() => setIsLoading(false))
  }, [favoritesIds, isInitialized, user]) // Se vuelve a ejecutar si la lista de favoritos o el estado de carga cambian.

  if (!isInitialized || isLoading) {
    return (
      <div className='flex flex-col gap-3' aria-busy='true'>
        <Skeleton className='h-10 w-full rounded-xl' />
        {['a', 'b', 'c', 'd'].map((key) => (
          <div key={key} className='flex items-center gap-4 px-3 py-2'>
            <Skeleton className='aspect-video w-24 rounded-lg' />
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-4 w-1/3' />
              <Skeleton className='h-3 w-1/4' />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (favoriteSongs.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title={t('noFavorites')}
        description={tp('emptyHint')}
      >
        <Link
          href='/'
          className='inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85'
        >
          <Music aria-hidden='true' className='size-4' />
          {tp('explore')}
        </Link>
      </EmptyState>
    )
  }

  return <SongList songs={favoriteSongs} />
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
      <FavoritesPageBody />
    </ProtectedPage>
  )
}
