import Link from 'next/link'
import Image from 'next/image'
import type { SongWithArtist } from '@/types/app.types'
import { JSX } from 'react'
import { FavoriteButton } from './favorite-button'

export function SongListItem ({ song }: { song: SongWithArtist }): JSX.Element {
  return (
    <div
      className='flex items-center gap-2 px-1 py-0.5 cursor-default hover:bg-primary hover:text-primary-foreground group'
      title={`${song.title ?? 'Unknown Title'} - ${song.artist?.name || 'Unknown Artist'}`}
      style={{ fontFamily: "'Tahoma', 'MS Sans Serif', sans-serif", fontSize: '11px' }}
    >
      {/* Small 16x16 style icon */}
      <div className='shrink-0' style={{ width: '16px', height: '16px', overflow: 'hidden', border: '1px solid #808080' }}>
        <Image
          alt={`${song.title ?? 'Unknown Title'}`}
          src={`${song.coverArt ?? ''}`}
          width='16'
          height='16'
          decoding='async'
          unoptimized
          className='w-full h-full object-cover'
        />
      </div>
      <div className='grow min-w-0 flex items-center gap-4'>
        <Link
          href={`/songs/${song.slug}`}
          className='truncate text-foreground group-hover:text-primary-foreground font-normal'
          style={{ fontSize: '11px', textDecoration: 'none' }}
        >
          {song.title}
        </Link>
        <span className='text-muted-foreground group-hover:text-primary-foreground/80 shrink-0' style={{ fontSize: '11px' }}>
          {song.artist?.name ?? 'Unknown Artist'}
        </span>
      </div>
      <div className='flex items-center gap-2 shrink-0'>
        <Link
          href={`/songs/${song.slug}`}
          className='win-button text-xs hidden md:block group-hover:text-foreground'
          style={{ fontSize: '10px', padding: '1px 6px', textDecoration: 'none', color: '#000' }}
        >
          Ver Acordes
        </Link>
        <FavoriteButton song={song} />
      </div>
    </div>
  )
}
