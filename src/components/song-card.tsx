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
  const artistsName = song.artists.map(a => a.name).join(', ') ?? 'Artista desconocido'
  const songTitle = song.title ?? 'Sin titulo'
  const songSlug = song.slug ?? 'Sin slug'
  const songCover = song.coverArt ?? ''

  return (
    <div className='group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300'>
      <div className='h-auto w-auto aspect-video relative overflow-hidden'>
        <Image
          alt={`${songTitle} - ${artistsName}`}
          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
          src={`${songCover}`}
          width='70'
          height='100'
          unoptimized
        />
      </div>
      <div className='p-5'>
        <Link
          href={`/songs/${songSlug}`}
          className='text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors'
        >
          {songTitle}
        </Link>
        <p className='text-slate-500 dark:text-slate-400 text-sm mb-4 truncate'>{artistsName}</p>
        <div className='flex items-center justify-between'>
          <button className='bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary hover:text-slate-900 transition-all'>Ver Acordes</button>
          <FavoriteButton song={song} />
        </div>
      </div>
    </div>
  )
}
