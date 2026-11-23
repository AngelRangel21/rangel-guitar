'use client'

import { Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type JSX, useId, useState } from 'react'
import { cn } from '@/lib/utils'
import { STAR_VALUES } from './rating.utils'

interface StarRatingInputProps {
  /** Valoración actual del usuario (null si no ha valorado). */
  value: number | null
  onChange: (value: number) => void
  disabled?: boolean
  /** `id` del texto visible que da nombre al grupo. */
  labelledBy: string
}

/**
 * Selector de 1 a 5 estrellas. Usa radios nativos (ocultos) para que funcione
 * con teclado (flechas) y lectores de pantalla; las estrellas muestran una
 * vista previa al pasar el ratón.
 */
export function StarRatingInput({
  value,
  onChange,
  disabled = false,
  labelledBy
}: StarRatingInputProps): JSX.Element {
  const t = useTranslations('songRating')
  const name = useId()
  const [hovered, setHovered] = useState<number | null>(null)
  const shown = hovered ?? value ?? 0

  return (
    <fieldset
      aria-labelledby={labelledBy}
      className='inline-flex items-center'
      disabled={disabled}
      onMouseLeave={() => setHovered(null)}
    >
      {STAR_VALUES.map((star) => {
        const isActive = star <= shown
        return (
          <label
            key={star}
            onMouseEnter={() => setHovered(star)}
            className={cn(
              'group relative cursor-pointer rounded-md p-1 transition-transform',
              !disabled && 'hover:scale-110',
              disabled && 'cursor-not-allowed opacity-60'
            )}
          >
            <input
              type='radio'
              name={name}
              value={star}
              checked={value === star}
              onChange={() => onChange(star)}
              className='peer sr-only'
            />
            <span className='sr-only'>{t('starLabel', { count: star })}</span>
            <Star
              aria-hidden='true'
              className={cn(
                'size-7 transition-colors sm:size-8',
                'rounded-sm peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-card',
                isActive
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-muted-foreground/40'
              )}
            />
          </label>
        )
      })}
    </fieldset>
  )
}
