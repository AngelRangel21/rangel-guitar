'use client'

import { Mic2, Music2, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { JSX } from 'react'
import {
  HeaderStat,
  PageHeader,
  PageShell
} from '@/components/layout/page-header'
import { SongArtwork } from '@/components/song-artwork'
import { SongList } from '@/components/song-list'
import type { SongWithArtist } from '@/types/app.types'

interface ArtistDetailContentProps {
  artistName: string
  /** URL pública de la foto del artista (puede no existir). */
  imageUrl: string | null
  songs: SongWithArtist[]
}

/** Página de un artista: cabecera con su foto y la lista de canciones. */
export function ArtistDetailContent({
  artistName,
  imageUrl,
  songs
}: ArtistDetailContentProps): JSX.Element {
  const t = useTranslations('artistsPage')

  return (
    <PageShell>
      <PageHeader
        back={{ href: '/artists', label: t('back') }}
        eyebrow={{ icon: Mic2, label: t('artistEyebrow') }}
        title={artistName}
        media={
          <SongArtwork
            src={imageUrl}
            alt={artistName}
            sizes='160px'
            fallbackIcon={User}
            className='size-28 rounded-full shadow-lg ring-4 ring-background md:size-40'
          />
        }
      >
        <div className='flex flex-wrap gap-2'>
          <HeaderStat icon={Music2}>
            {t('songCount', { count: songs.length })}
          </HeaderStat>
        </div>
      </PageHeader>

      <section aria-labelledby='artist-songs' className='space-y-4'>
        <h2
          id='artist-songs'
          className='text-2xl font-bold tracking-tight text-foreground font-headline'
        >
          {t('songsBy', { artist: artistName })}
        </h2>
        <SongList songs={songs} />
      </section>
    </PageShell>
  )
}
