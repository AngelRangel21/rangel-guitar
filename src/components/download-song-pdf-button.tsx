'use client'

import { FileDown } from 'lucide-react'
import type { JSX } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { useI18n } from '@/context/i18n-context'

interface DownloadSongPdfButtonProps {
  songSlug: string
  /** Semitonos de transposición actuales, para que el PDF coincida. */
  transpose: number
}

/**
 * Enlace de descarga del PDF de la canción. La generación ocurre en el
 * route handler `/api/songs/[slug]/pdf`, así que este componente no añade
 * ninguna librería al bundle del cliente.
 */
export function DownloadSongPdfButton({
  songSlug,
  transpose
}: DownloadSongPdfButtonProps): JSX.Element {
  const { t, language } = useI18n()

  const label = t('songs.pdf.download')
  const href = `/api/songs/${encodeURIComponent(
    songSlug
  )}/pdf?locale=${language}&transpose=${transpose}`

  return (
    <a
      className={buttonVariants({ variant: 'outline', className: 'w-full' })}
      href={href}
      download
      aria-label={label}
    >
      <FileDown className='mr-2 h-4 w-4' aria-hidden='true' />
      {label}
    </a>
  )
}
