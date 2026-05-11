import { User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { JSX } from 'react'
import { Card } from '@/components/ui/card'
import { getArtistImage } from '@/services/artists.service'
import type { ArtistCount } from '@/types/app.types'

/**
 * Componente que muestra una tarjeta individual para un artista.
 * Al hacer clic, navega a la página de detalle de ese artista.
 * @param {{ artistName: string }} props - Propiedades del componente, contiene el nombre del artista.
 * @returns {JSX.Element} La tarjeta del artista.
 */
export function ArtistCard({ artist }: { artist: ArtistCount }): JSX.Element {
  const songCount = artist.count ?? 0

  const imageUrl = artist.image_url
    ? getArtistImage(artist.image_url)
    : 'https://placehold.co/400x400.png'

  return (
    // Enlace que envuelve toda la tarjeta para la navegación.
    <Link
      href={`/artists/${artist.slug}`}
      aria-label={`Ver canciones de ${artist.name}`}
    >
      <Card className='group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-transparent bg-card w-full h-full cursor-pointer flex flex-col'>
        <div className='relative'>
          {/* Imagen del artista. */}
          <Image
            src={imageUrl}
            alt={`Foto de ${artist.name}`}
            width={400}
            height={400}
            className='aspect-square object-cover w-full transition-transform duration-300 group-hover:scale-105'
            data-ai-hint='musician portrait'
            priority={false}
            loading='lazy'
            unoptimized
          />
          {/* Superposición con icono que aparece al pasar el ratón. */}
          <div className='absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
            <User className='h-12 w-12 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0' />
          </div>
        </div>
        <div className='p-3 grow flex items-center justify-between'>
          {/* Nombre del artista. */}
          <h3 className='font-semibold text-foreground truncate'>
            {artist.name}
          </h3>
          {songCount === 1 ? (
            <p className='flex flex-row text-xs text-muted-foreground truncate'>
              {songCount} canción
            </p>
          ) : (
            <p className='flex flex-row text-xs text-muted-foreground truncate'>
              {songCount} canciones
            </p>
          )}
        </div>
      </Card>
    </Link>
  )
}
