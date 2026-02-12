'use client'

// components/SongSearch.tsx

import React, { useRef, useEffect, useState, KeyboardEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearch } from '@/hooks/useSearch'
import { Song } from '@/lib/types'
import { MusicIcon, Search, X } from 'lucide-react'
import { Spinner } from './ui/spinner'

// ─── Subcomponentes ───────────────────────────────────────────────────────────

function SongCover({ src, alt }: { src: string | null; alt: string }) {
  const [imgError, setImgError] = useState(false)

  if (!src || imgError) {
    return (
      <div className='w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0'>
        <MusicIcon className='w-5 h-5 text-muted-foreground' />
      </div>
    )
  }

  return (
    <div className='relative w-10 h-10 rounded-md overflow-hidden shrink-0'>
      <Image
        src={src}
        alt={alt}
        fill
        className='object-cover'
        onError={() => setImgError(true)}
        sizes='40px'
        decoding='async'
      />
    </div>
  )
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className='bg-transparent text-white font-semibold'>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}

function ResultItem({
  song,
  query,
  isActive,
  onMouseEnter,
  onClick,
}: {
  song: Song
  query: string
  isActive: boolean
  onMouseEnter: () => void
  onClick: () => void
}) {
  return (
    <Link
      href={`/songs/${song.slug}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer outline-none
        ${isActive ? 'bg-accent' : 'hover:bg-accent/60'}`}
    >
      <SongCover src={song.coverArt} alt={song.title} />
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-medium text-foreground truncate leading-snug'>
          <HighlightMatch text={song.title} query={query} />
        </p>
        <p className='text-xs text-muted-foreground truncate leading-snug'>
          <HighlightMatch text={song.artist} query={query} />
        </p>
      </div>
    </Link>
  )
}

function SearchDropdown({
  results,
  query,
  isLoading,
  hasSearched,
  error,
  activeIndex,
  onMouseEnter,
  onClose,
}: {
  results: Song[]
  query: string
  isLoading: boolean
  hasSearched: boolean
  error: string | null
  activeIndex: number
  onMouseEnter: (i: number) => void
  onClose: () => void
}) {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className='absolute top-full left-0 right-0 mt-1.5 z-50 bg-popover border border-border rounded-xl shadow-lg p-2'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='flex items-center gap-3 px-3 py-2.5'>
            <div className='w-10 h-10 rounded-md bg-muted animate-pulse shrink-0' />
            <div className='flex-1 space-y-1.5'>
              <div className='h-3 bg-muted rounded animate-pulse w-3/4' />
              <div className='h-3 bg-muted rounded animate-pulse w-1/2' />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Error
  if (error) {
    return (
      <div className='absolute top-full left-0 right-0 mt-1.5 z-50 bg-popover border border-border rounded-xl shadow-lg p-4'>
        <p className='text-sm text-destructive text-center'>{error}</p>
      </div>
    )
  }

  // Sin resultados
  if (hasSearched && results.length === 0) {
    return (
      <div className='absolute top-full left-0 right-0 mt-1.5 z-50 bg-popover border border-border rounded-xl shadow-lg p-6'>
        <div className='flex flex-col items-center gap-2 text-muted-foreground'>
          <MusicIcon className='w-8 h-8 opacity-40' />
          <p className='text-sm'>No encontramos resultados para</p>
          <p className='text-sm font-medium text-foreground'>"{query}"</p>
        </div>
      </div>
    )
  }

  // Resultados
  if (results.length === 0) return null

  return (
    <div className='absolute top-full left-0 right-0 mt-1.5 z-50 bg-popover border border-border rounded-xl shadow-lg p-2'>
      {results.map((song, i) => (
        <ResultItem
          key={song.id}
          song={song}
          query={query}
          isActive={i === activeIndex}
          onMouseEnter={() => onMouseEnter(i)}
          onClick={onClose}
        />
      ))}
    </div>
  )
}

// ─── Componente Principal ─────────────────────────────────────────────────────

interface SongSearchProps {
  /** Placeholder del input */
  placeholder?: string
  /** Clase CSS extra para el contenedor */
  className?: string
  /** Callback cuando el usuario selecciona una canción */
  onSelect?: (song: Song) => void
}

export function SongSearch({
  placeholder = 'Buscar canción o artista...',
  className = '',
  onSelect,
}: SongSearchProps) {
  const { query, results, isLoading, error, hasSearched, search, searchImmediate, clear } =
    useSearch()

  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const showDropdown = isOpen && (isLoading || hasSearched || results.length > 0)

  // ── Cerrar al hacer clic fuera ──────────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ── Reset activeIndex cuando cambian resultados ─────────────────────────────
  useEffect(() => {
    setActiveIndex(-1)
  }, [results])

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    search(val)
    setIsOpen(true)
    setActiveIndex(-1)
  }

  const handleFocus = () => {
    if (query.trim().length >= 2) setIsOpen(true)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(prev => Math.min(prev + 1, results.length - 1))
        break

      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(prev => Math.max(prev - 1, -1))
        break

      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && results[activeIndex]) {
          // Navegar a la canción seleccionada por teclado
          onSelect?.(results[activeIndex])
          handleClose()
          window.location.href = `/songs/${results[activeIndex].slug}`
        } else {
          // Búsqueda inmediata con Enter
          searchImmediate(query)
        }
        break

      case 'Escape':
        handleClose()
        break
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setActiveIndex(-1)
    inputRef.current?.blur()
  }

  const handleClear = () => {
    clear()
    setIsOpen(false)
    setActiveIndex(-1)
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* ── Input ── */}
      <div className='relative flex items-center'>
        <Search className='absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none' />

        <input
          ref={inputRef}
          type='text'
          role='combobox'
          aria-expanded={showDropdown}
          aria-autocomplete='list'
          aria-controls='search-results'
          aria-activedescendant={activeIndex >= 0 ? `result-${activeIndex}` : undefined}
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className='w-full h-10 pl-9 pr-9 text-sm bg-background border border-input rounded-lg
            placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
            transition-shadow'
          autoComplete='off'
          spellCheck={false}
        />

        {/* Botón limpiar o spinner */}
        {isLoading ? (
          <Spinner className='absolute right-3 w-4 h-4' />
        ) : query ? (
          <button
            type='button'
            onClick={handleClear}
            aria-label='Limpiar búsqueda'
            className='absolute right-3 text-muted-foreground hover:text-foreground transition-colors'
          >
            <X className='w-4 h-4' />
          </button>
        ) : null}
      </div>

      {/* ── Dropdown ── */}
      {showDropdown && (
        <SearchDropdown
          results={results}
          query={query}
          isLoading={isLoading}
          hasSearched={hasSearched}
          error={error}
          activeIndex={activeIndex}
          onMouseEnter={setActiveIndex}
          onClose={handleClose}
        />
      )}
    </div>
  )
}
