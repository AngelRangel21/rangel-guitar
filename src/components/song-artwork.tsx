'use client'

import { type LucideIcon, MusicIcon } from 'lucide-react'
import Image from 'next/image'
import { type JSX, useState } from 'react'
import { cn } from '@/lib/utils'

interface SongArtworkProps {
  src: string | null
  alt: string
  /** Valor de `sizes` para la imagen responsive. */
  sizes: string
  className?: string
  imageClassName?: string
  /** Icono a mostrar cuando no hay imagen. */
  fallbackIcon?: LucideIcon
}

/**
 * Portada de una canción que ocupa todo su contenedor, con un fallback
 * cuando no hay imagen o falla la carga.
 */
export function SongArtwork({
  src,
  alt,
  sizes,
  className,
  imageClassName,
  fallbackIcon: FallbackIcon = MusicIcon
}: SongArtworkProps): JSX.Element {
  const [hasError, setHasError] = useState(false)

  return (
    <div className={cn('relative overflow-hidden bg-muted', className)}>
      {src == null || src === '' || hasError ? (
        <div className='absolute inset-0 flex items-center justify-center bg-linear-to-br from-muted to-secondary'>
          <FallbackIcon
            aria-hidden='true'
            className='size-1/3 max-w-10 text-muted-foreground/60'
          />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={cn('object-cover', imageClassName)}
          onError={() => setHasError(true)}
          decoding='async'
          unoptimized
        />
      )}
    </div>
  )
}
