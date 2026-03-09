import Link from 'next/link'
import Image from 'next/image'
import type { SongWithArtist } from '@/types/app.types'
import { JSX } from 'react'
import { FavoriteButton } from './favorite-button'

export function SongListItem ({ song }: { song: SongWithArtist }): JSX.Element {
  return (
    <div
      className='flex flex-col gap-2'
      title={`${song.title ?? 'Unknown Title'} - ${song.artist?.name || 'Unknown Artist'}`}
    >
      <div
        className='flex items-center gap-4 p-3 bg-transparent hover:bg-[#1E293B] border border-transparent hover:border-slate-800 rounded-xl transition-all duration-200 group'
      >
        <div className='h-auto w-auto aspect-video relative overflow-hidden'>
          <Image
            alt={`${song.title ?? 'Unknown Title'} - ${song.artist?.name || 'Unknown Artist'}`}
            className='rounded-lg object-cover shrink-0'
            src={`${song.coverArt ?? ''}`}
            width='80'
            height='48'
            decoding='async'
            unoptimized
          />
        </div>
        <div className='grow min-w-0'>
          <Link
            href={`/songs/${song.slug}`}
            className='text-white font-bold truncate transition-colors'
          >
            {song.title}
          </Link>
          <p
            className='text-slate-400 text-sm'
          >
            {song.artist?.name ?? 'Unknown Artist'}
          </p>
        </div>
        <div className='flex items-center gap-6'>
          <Link
            href={`/songs/${song.slug}`}
            className='hidden md:block dark:hover:bg-slate-950 bg-slate-800 text-slate-200 px-5 py-2 rounded-xl text-sm font-bold transition-all border whitespace-nowrap'
          >
            Ver Acordes
          </Link>
          <FavoriteButton song={song} />
        </div>
      </div>
    </div>
  )
}
