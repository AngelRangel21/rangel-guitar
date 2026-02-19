import Link from 'next/link'
import Image from 'next/image'
import type { Song } from '@/types'
import { ChevronRight } from 'lucide-react'
import { JSX } from 'react'

/**
 * Componente que muestra un elemento de canción en formato de lista.
 * @param {{ song: Song }} props - Propiedades del componente, contiene los datos de la canción.
 * @returns {JSX.Element} El elemento de la lista de canciones.
 */
export function SongListItem ({ song }: { song: Song }): JSX.Element {
  return (
    <Link
      href={`/songs/${song.slug}`}
      className='block transition-colors duration-200 rounded-lg hover:bg-secondary/80 group'
      aria-label={`Ver canción ${song.title} de ${song.artist}`}
      title={`Canción ${song.title} de ${song.artist}`}
    >
      <section className='flex items-center gap-4 p-2 '>
        <Image
          src={`${song.coverArt ?? ''}`}
          alt={`Portada de la cancion ${song.title} del artista ${song.artist}`}
          title={`Portada de la cancion ${song.title} del artista ${song.artist}`}
          decoding='async'
          width='80'
          height='48'
        />

        <div className='grow'>
          <p className='font-semibold text-black dark:text-white'>
            {song.title} - <span className='text-sm text'>{song.artist}</span>
          </p>
        </div>
        <ChevronRight className='h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1' />
      </section>
    </Link>
  )
}
