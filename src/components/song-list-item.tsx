import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { JSX } from 'react'
import { Link } from '@/i18n/navigation'
import type { SongWithArtist } from '@/types/app.types'
import { FavoriteButton } from './favorite-button'

export function SongListItem({ song }: { song: SongWithArtist }): JSX.Element {
  const t = useTranslations('songList.list')

  const artistsName =
    song.artists.map((a) => a.name).join(', ') ?? t('notArtists')
  const songTitle = song.title ?? t('notTitle')
  const songSlug = song.slug ?? t('notSlug')
  const songCover = song.coverArt ?? ''

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center gap-4 p-3 bg-transparent hover:bg-[#4b628f] dark:hover:bg-[#1E293B] border border-transparent rounded-xl transition-all duration-200 group'>
        <div className='h-auto w-auto aspect-video relative overflow-hidden'>
          <Image
            alt={`${songTitle} - ${artistsName}`}
            className='rounded-lg object-cover shrink-0'
            src={`${songCover}`}
            width='80'
            height='48'
            decoding='async'
            unoptimized
          />
        </div>
        <div className='grow min-w-0'>
          <Link
            href={{
              pathname: '/songs/[slug]',
              params: { slug: `${songSlug}` }
            }}
            className='text-slate-950 dark:text-white font-bold transition-colors'
          >
            {songTitle}
          </Link>
          <p className='text-slate-900 dark:text-white text-sm'>
            {artistsName}
          </p>
        </div>
        <div className='flex items-center gap-6'>
          <Link
            href={{
              pathname: '/songs/[slug]',
              params: { slug: `${songSlug}` }
            }}
            className='hidden md:block dark:hover:bg-slate-950 bg-slate-800 text-slate-200 px-5 py-2 rounded-xl text-sm font-bold transition-all border whitespace-nowrap'
          >
            {t('viewChords')}
          </Link>
          <FavoriteButton song={song} />
        </div>
      </div>
    </div>
  )
}
