import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { JSX } from 'react'
import { Link } from '@/i18n/navigation'
import type { SongWithArtist } from '@/types/app.types'
import { FavoriteButton } from './favorite-button'

interface SongCardProps {
  song: SongWithArtist
}

export function SongCard({ song }: SongCardProps): JSX.Element {
  const t = useTranslations('songList.grid')
  const artistsName =
    song.artists.map((a) => a.name).join(', ') ?? t('notArtists')
  const songTitle = song.title ?? t('notTitle')
  const songSlug = song.slug ?? t('notSlug')
  const songCover = song.coverArt ?? ''

  return (
    <div className='group bg-card rounded-2xl overflow-hidden border-2 border-transparent shadow-sm hover:shadow-xl hover:shadow-accent/10 hover:border-accent/30 transition-all duration-300 hover:-translate-y-1'>
      <div className='aspect-video relative overflow-hidden bg-muted'>
        <Image
          alt={`${songTitle} - ${artistsName}`}
          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
          src={`${songCover}`}
          width='70'
          height='100'
          unoptimized
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
      </div>
      <div className='p-5'>
        <Link
          href={{ pathname: '/songs/[slug]', params: { slug: `${songSlug}` } }}
          className='text-lg font-bold text-foreground line-clamp-1 group-hover:text-accent transition-colors duration-200'
        >
          {songTitle}
        </Link>
        <p className='text-muted-foreground text-sm mb-4 truncate'>
          {artistsName}
        </p>
        <div className='flex items-center justify-between'>
          <Link
            href={{
              pathname: '/songs/[slug]',
              params: { slug: `${songSlug}` }
            }}
            className='bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-lg'
          >
            {t('viewChords')}
          </Link>
          <FavoriteButton song={song} />
        </div>
      </div>
    </div>
  )
}
