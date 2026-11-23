import { useTranslations } from 'next-intl'
import type { JSX } from 'react'
import { Link } from '@/i18n/navigation'
import type { SongWithArtist } from '@/types/app.types'
import { FavoriteButton } from './favorite-button'
import { SongArtwork } from './song-artwork'

interface SongCardProps {
  song: SongWithArtist
}

export function SongCard({ song }: SongCardProps): JSX.Element {
  const t = useTranslations('songList.grid')
  const artistsName =
    song.artists.map((a) => a.name).join(', ') || t('notArtists')
  const songTitle = song.title ?? t('notTitle')
  const songSlug = song.slug ?? t('notSlug')

  return (
    <article className='group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-within:ring-2 focus-within:ring-ring'>
      <div className='relative'>
        <SongArtwork
          src={song.coverArt}
          alt=''
          sizes='(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw'
          className='aspect-video w-full'
          imageClassName='transition-transform duration-500 group-hover:scale-105'
        />
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'
        />
        {song.key != null && song.key !== '' && (
          <span className='absolute left-2 top-2 rounded-md bg-background/85 px-2 py-0.5 text-xs tabular-nums font-semibold text-foreground backdrop-blur-sm'>
            {song.key}
          </span>
        )}
        <div className='absolute right-1 top-1 z-10 rounded-full bg-background/70 backdrop-blur-sm [&:has(>div:empty)]:hidden'>
          <FavoriteButton song={song} />
        </div>
      </div>

      <div className='flex min-w-0 flex-1 flex-col gap-0.5 p-3 sm:p-4'>
        {/* El enlace se estira sobre toda la tarjeta con `after:` */}
        <Link
          href={{ pathname: '/songs/[slug]', params: { slug: songSlug } }}
          aria-label={`${t('viewChords')}: ${songTitle} - ${artistsName}`}
          className='line-clamp-1 font-semibold text-foreground outline-none after:absolute after:inset-0'
        >
          {songTitle}
        </Link>
        <p className='truncate text-sm text-muted-foreground'>{artistsName}</p>
      </div>
    </article>
  )
}
