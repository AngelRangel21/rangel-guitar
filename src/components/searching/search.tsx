'use client'

// components/SongSearch.tsx

import { MusicIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type JSX, type KeyboardEvent, useRef, useState } from 'react'
import type { SearchSong } from '@/components/searching/search.types'
import { useSearch } from '@/components/searching/useSearch'
import { Link, useRouter } from '@/i18n/navigation'
import { Popover, PopoverAnchor, PopoverContent } from '../ui/popover'
import { SearchInput } from './search-input'
import { HighlightMatch, SongCover } from './search-visuals'

const SKELETON_ROWS = ['skeleton-1', 'skeleton-2', 'skeleton-3'] as const

// ─── Subcomponentes ───────────────────────────────────────────────────────────

function ResultItem({
  song,
  query,
  index,
  isActive,
  onMouseEnter,
  onClick
}: {
  song: SearchSong
  query: string
  index: number
  isActive: boolean
  onMouseEnter: () => void
  onClick: () => void
}) {
  return (
    <Link
      href={{ pathname: '/songs/[slug]', params: { slug: `${song.slug}` } }}
      id={`result-${index}`}
      role='option'
      aria-selected={isActive}
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
  onClose
}: {
  results: SearchSong[]
  query: string
  isLoading: boolean
  hasSearched: boolean
  error: string | null
  activeIndex: number
  onMouseEnter: (i: number) => void
  onClose: () => void
}): JSX.Element | null {
  const t = useTranslations('homeClient.search')
  // Loading skeleton
  if (isLoading) {
    return (
      <div className='p-2'>
        {SKELETON_ROWS.map((row) => (
          <div key={row} className='flex items-center gap-3 px-3 py-2.5'>
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
      <div className='p-4'>
        <p className='text-sm text-destructive text-center'>{error}</p>
      </div>
    )
  }

  // Sin resultados
  if (hasSearched && results.length === 0) {
    return (
      <div className='p-6'>
        <div className='flex flex-col items-center gap-2 text-muted-foreground'>
          <MusicIcon className='w-8 h-8 opacity-40' />
          <p className='text-sm'>{t('noResults')}</p>
          <p className='text-sm font-medium text-foreground'>"{query}"</p>
        </div>
      </div>
    )
  }

  // Resultados
  if (results.length === 0) return null

  const trimmedQuery = query.trim()

  return (
    <div className='p-2'>
      {results.map((song, i) => (
        <ResultItem
          key={song.id}
          song={song}
          query={query}
          index={i}
          isActive={i === activeIndex}
          onMouseEnter={() => onMouseEnter(i)}
          onClick={onClose}
        />
      ))}

      {trimmedQuery.length >= 2 && (
        <Link
          href={{ pathname: '/search', query: { q: trimmedQuery } }}
          onClick={onClose}
          className='mt-1 flex items-center justify-center gap-2 rounded-lg border-t border-border px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground'
        >
          {t('seeAllResults')} “{trimmedQuery}”
        </Link>
      )}
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
  onSelect?: (song: SearchSong) => void
  /** Callback al enviar la búsqueda sin una canción seleccionada */
  onSubmit?: (query: string) => void
}

export function SongSearch({
  placeholder = '',
  className = '',
  onSelect,
  onSubmit
}: SongSearchProps): JSX.Element {
  const {
    query,
    results,
    isLoading,
    error,
    hasSearched,
    search,
    searchImmediate,
    clear
  } = useSearch()

  const t = useTranslations('homeClient.search')
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const inputContainerRef = useRef<HTMLDivElement>(null)

  const showDropdown =
    isOpen && (isLoading || hasSearched || results.length > 0)

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) setActiveIndex(-1)
  }

  const handleChange = (value: string) => {
    search(value)
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
        setActiveIndex((prev) => Math.min(prev + 1, results.length - 1))
        break

      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) => Math.max(prev - 1, -1))
        break

      case 'Enter': {
        e.preventDefault()
        const selected = activeIndex >= 0 ? results[activeIndex] : undefined

        if (selected) {
          onSelect?.(selected)
          handleClose()
          // Navegación localizada: respeta `/cancion/...` en español.
          router.push({
            pathname: '/songs/[slug]',
            params: { slug: selected.slug }
          })
        } else if (onSubmit != null) {
          handleClose()
          onSubmit(query)
        } else {
          // Búsqueda inmediata con Enter
          searchImmediate(query)
        }
        break
      }

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
    <div
      className={`relative w-full ${className}`}
      suppressHydrationWarning={true}
    >
      <Popover open={showDropdown} onOpenChange={handleOpenChange}>
        {/* ── Input ── */}
        <PopoverAnchor asChild>
          <div ref={inputContainerRef} className='w-full'>
            <SearchInput
              value={query}
              onChange={handleChange}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              onClear={handleClear}
              placeholder={placeholder}
              label={placeholder}
              clearLabel={t('clear')}
              isLoading={isLoading}
              inputRef={inputRef}
              combobox={{
                expanded: showDropdown,
                controls: 'search-results',
                activeDescendant:
                  activeIndex >= 0 ? `result-${activeIndex}` : undefined
              }}
            />
          </div>
        </PopoverAnchor>

        {/* ── Dropdown ── */}
        <PopoverContent
          id='search-results'
          align='start'
          side='bottom'
          sideOffset={6}
          role={
            !isLoading && error == null && results.length > 0
              ? 'listbox'
              : undefined
          }
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            // El ancla no es un trigger de Radix, así que sin esto un clic
            // dentro del input cerraría el panel.
            if (inputContainerRef.current?.contains(e.target as Node)) {
              e.preventDefault()
            }
          }}
          className='overflow-y-auto rounded-xl p-0'
          style={{
            width: 'var(--radix-popover-trigger-width)',
            maxHeight:
              'min(24rem, var(--radix-popover-content-available-height))'
          }}
        >
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
        </PopoverContent>
      </Popover>
    </div>
  )
}
