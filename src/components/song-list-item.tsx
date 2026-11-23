import { ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { JSX } from 'react'
import { Link } from '@/i18n/navigation'
import type { SongWithArtist } from '@/types/app.types'
import { FavoriteButton } from './favorite-button'
import { SongArtwork } from './song-artwork'

interface SongListItemProps {
  song: SongWithArtist
  /** Posición de la canción en la lista (1-based). */
  position?: number
}

export function SongListItem({
  song,
  position
}: SongListItemProps): JSX.Element {
  const t = useTranslations('songList.list')

  const artistsName =
    song.artists.map((a) => a.name).join(', ') || t('notArtists')
  const songTitle = song.title ?? t('notTitle')
  const songSlug = song.slug ?? t('notSlug')

  return (
    <article className='group relative flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted/60 focus-within:bg-muted/60 sm:gap-4 sm:px-3'>
      {position != null && (
        <span
          aria-hidden='true'
          className='hidden w-6 shrink-0 text-right text-sm tabular-nums text-muted-foreground sm:block'
        >
          {position}
        </span>
      )}

      <SongArtwork
        src={song.coverArt}
        alt=''
        sizes='96px'
        className='aspect-video w-20 shrink-0 rounded-lg ring-1 ring-border sm:w-24'
      />

      <div className='min-w-0 flex-1'>
        {/* El enlace se estira sobre toda la fila con `after:` */}
        <Link
          href={{ pathname: '/songs/[slug]', params: { slug: songSlug } }}
          aria-label={`${t('viewChords')}: ${songTitle} - ${artistsName}`}
          className='block truncate font-semibold text-foreground outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-ring'
        >
          {songTitle}
        </Link>
        <p className='truncate text-sm text-muted-foreground'>{artistsName}</p>
      </div>

      {song.key != null && song.key !== '' && (
        <span className='hidden shrink-0 rounded-md border bg-background px-2 py-0.5 text-xs tabular-nums font-medium text-muted-foreground sm:inline-block'>
          {song.key}
        </span>
      )}

      <div className='relative z-10 flex shrink-0 items-center'>
        <FavoriteButton song={song} />
      </div>

      <ChevronRight
        aria-hidden='true'
        className='size-5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground'
      />
    </article>
  )
}
