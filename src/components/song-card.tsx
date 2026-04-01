import type { SongWithArtist } from '@/types/app.types'
import Link from 'next/link'
import { JSX } from 'react'
import Image from 'next/image'
import { FavoriteButton } from './favorite-button'

/**
 * Propiedades que el componente SongCard espera recibir.
 */
interface SongCardProps {
  song: SongWithArtist
}

/**
 * Componente que muestra una tarjeta individual para una canción en la vista de cuadrícula.
 * @param {SongCardProps} props - Propiedades del componente, contiene los datos de la canción.
 * @returns {JSX.Element} La tarjeta de la canción.
 */
export function SongCard ({ song }: SongCardProps): JSX.Element {
  return (
    <div className='win-window flex flex-col' style={{ fontFamily: "'Tahoma', 'MS Sans Serif', sans-serif" }}>
      {/* Mini title bar */}
      <div style={{ background: 'linear-gradient(to right, #0a246a, #a6caf0)', padding: '2px 4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
        <span style={{ fontSize: '9px', color: '#fff', fontWeight: 'bold', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', flex: 1 }}>{song.title}</span>
      </div>
      {/* Cover art in inset frame */}
      <div className='win-inset m-1' style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
        <Image
          alt={`${song.title} - ${song.artist.name}`}
          className='w-full h-full object-cover'
          src={`${song.coverArt ?? ''}`}
          width='200'
          height='112'
          unoptimized
        />
      </div>
      <div className='px-2 pb-2'>
        <Link
          href={`/songs/${song.slug}`}
          className='block font-bold text-foreground truncate'
          style={{ fontSize: '11px', textDecoration: 'none' }}
        >
          {song.title}
        </Link>
        <p className='text-muted-foreground truncate mb-2' style={{ fontSize: '10px' }}>{song.artist.name}</p>
        <div className='flex items-center justify-between'>
          <Link href={`/songs/${song.slug}`} className='win-button' style={{ fontSize: '10px', textDecoration: 'none', color: '#000' }}>
            Ver Acordes
          </Link>
          <FavoriteButton song={song} />
        </div>
      </div>
    </div>
  )
}
