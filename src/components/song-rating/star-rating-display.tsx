import { Star } from 'lucide-react'
import type { JSX } from 'react'
import { cn } from '@/lib/utils'
import { getStarFill, STAR_VALUES } from './rating.utils'

interface StarRatingDisplayProps {
  /** Media de 0 a 5; admite decimales (relleno parcial). */
  value: number
  /** Texto para lectores de pantalla, p. ej. "4,3 de 5 estrellas". */
  label: string
  className?: string
  starClassName?: string
}

/** Estrellas de solo lectura con relleno parcial para la media. */
export function StarRatingDisplay({
  value,
  label,
  className,
  starClassName = 'size-4'
}: StarRatingDisplayProps): JSX.Element {
  return (
    <span
      role='img'
      aria-label={label}
      className={cn('inline-flex items-center gap-0.5', className)}
    >
      {STAR_VALUES.map((star) => {
        const fill = getStarFill(value, star)
        return (
          <span key={star} className='relative inline-flex'>
            <Star
              aria-hidden='true'
              className={cn('text-muted-foreground/30', starClassName)}
            />
            {fill > 0 && (
              <span
                className='absolute inset-0 overflow-hidden'
                style={{ width: `${fill * 100}%` }}
              >
                <Star
                  aria-hidden='true'
                  className={cn('fill-amber-400 text-amber-400', starClassName)}
                />
              </span>
            )}
          </span>
        )
      })}
    </span>
  )
}
