'use client'

import { MusicIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

const COVER_SIZES = {
  sm: { box: 'w-10 h-10', icon: 'w-5 h-5', sizes: '40px' },
  md: { box: 'w-14 h-14', icon: 'w-6 h-6', sizes: '56px' }
} as const

interface SongCoverProps {
  src: string | null
  alt: string
  size?: keyof typeof COVER_SIZES
}

/** Portada de una canción con fallback cuando no hay imagen o falla. */
export function SongCover({ src, alt, size = 'sm' }: SongCoverProps) {
  const [imgError, setImgError] = useState(false)
  const { box, icon, sizes } = COVER_SIZES[size]

  if (!src || imgError) {
    return (
      <div
        className={`${box} rounded-md bg-muted flex items-center justify-center shrink-0`}
      >
        <MusicIcon className={`${icon} text-muted-foreground`} />
      </div>
    )
  }

  return (
    <div
      className={`relative ${box} rounded-md overflow-hidden shrink-0 bg-muted`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className='object-cover'
        onError={() => setImgError(true)}
        sizes={sizes}
        decoding='async'
      />
    </div>
  )
}

interface HighlightMatchProps {
  text: string
  query: string
}

/**
 * Resalta las apariciones del término dentro del texto.
 * La comparación es case-insensitive y no usa regex, para evitar el estado
 * interno de `lastIndex` que hacía que el resaltado fallara entre llamadas.
 */
export function HighlightMatch({ text, query }: HighlightMatchProps) {
  const term = query.trim()
  if (!term) return <span>{text}</span>

  const lowerText = text.toLowerCase()
  const lowerTerm = term.toLowerCase()
  const parts: Array<{ text: string; match: boolean; key: string }> = []
  let index = 0

  while (index < text.length) {
    const matchIndex = lowerText.indexOf(lowerTerm, index)

    if (matchIndex === -1) {
      parts.push({
        text: text.slice(index),
        match: false,
        key: `tail-${index}`
      })
      break
    }

    if (matchIndex > index) {
      parts.push({
        text: text.slice(index, matchIndex),
        match: false,
        key: `plain-${index}`
      })
    }

    parts.push({
      text: text.slice(matchIndex, matchIndex + term.length),
      match: true,
      key: `match-${matchIndex}`
    })
    index = matchIndex + term.length
  }

  return (
    <span>
      {parts.map((part) =>
        part.match ? (
          <mark
            key={part.key}
            className='bg-transparent font-semibold text-foreground'
          >
            {part.text}
          </mark>
        ) : (
          <span key={part.key}>{part.text}</span>
        )
      )}
    </span>
  )
}
