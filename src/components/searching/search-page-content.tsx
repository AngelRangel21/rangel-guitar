'use client'

import { MusicIcon, SearchX } from 'lucide-react'
import { useRouter as useNextRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  type FormEvent,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition
} from 'react'
import { useRouter } from '@/i18n/navigation'
import type { SearchResult } from './search.types'
import { MIN_QUERY_LENGTH } from './search.utils'
import { SearchInput } from './search-input'
import { SearchResults } from './search-results'

/** Espera antes de reflejar lo que se escribe en la URL. */
const URL_SYNC_DEBOUNCE_MS = 400

interface SearchPageContentProps {
  /** Término ya normalizado que vino en `?q=`. */
  initialQuery: string
  /** Resultados calculados en el servidor para `initialQuery`. */
  initialResult: SearchResult
  /** La consulta en servidor falló. */
  hasError: boolean
}

export function SearchPageContent({
  initialQuery,
  initialResult,
  hasError
}: SearchPageContentProps) {
  const t = useTranslations('searchPage')
  const router = useRouter()
  const nextRouter = useNextRouter()
  const inputId = useId()

  const [value, setValue] = useState(initialQuery)
  const [isPending, startTransition] = useTransition()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // La URL manda: al volver atrás o llegar desde un enlace, el input se ajusta.
  useEffect(() => {
    setValue(initialQuery)
  }, [initialQuery])

  // Refleja lo que se escribe en la URL sin llenar el historial.
  useEffect(() => {
    const nextQuery = value.trim()
    if (nextQuery === initialQuery) return

    debounceRef.current = setTimeout(() => {
      startTransition(() => {
        router.replace(
          nextQuery
            ? { pathname: '/search', query: { q: nextQuery } }
            : { pathname: '/search' },
          { scroll: false }
        )
      })
    }, URL_SYNC_DEBOUNCE_MS)

    return () => {
      if (debounceRef.current != null) clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
  }, [value, initialQuery, router])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Si se envía antes de que corra el debounce, no duplicamos la navegación.
    if (debounceRef.current != null) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }

    const nextQuery = value.trim()
    if (nextQuery === initialQuery) return

    router.push(
      nextQuery
        ? { pathname: '/search', query: { q: nextQuery } }
        : { pathname: '/search' }
    )
  }

  const hasQuery = initialQuery.length >= MIN_QUERY_LENGTH
  const hasResults = initialResult.songs.length > 0

  return (
    <main className='grow container mx-auto px-4 py-8 space-y-6'>
      <h1 className='text-3xl md:text-4xl font-bold text-foreground tracking-tight font-headline'>
        {hasQuery ? `${t('resultsFor')} “${initialQuery}”` : t('heading')}
      </h1>

      <search className='block max-w-xl' aria-busy={isPending}>
        <form onSubmit={handleSubmit}>
          <SearchInput
            id={inputId}
            value={value}
            onChange={setValue}
            placeholder={t('placeholder')}
            label={t('label')}
            clearLabel={t('clear')}
            onClear={() => setValue('')}
            isLoading={isPending}
          />
        </form>
      </search>

      <div
        aria-live='polite'
        className={isPending ? 'opacity-60 transition-opacity' : undefined}
      >
        {!hasQuery && (
          <div className='flex flex-col items-center gap-3 py-16 text-center text-muted-foreground'>
            <MusicIcon className='w-10 h-10 opacity-40' />
            <p>{t('emptyState')}</p>
          </div>
        )}

        {hasQuery && hasError && (
          <div className='flex flex-col items-center gap-3 py-16 text-center'>
            <p className='text-destructive'>{t('error')}</p>
            <button
              type='button'
              onClick={() => nextRouter.refresh()}
              className='rounded-lg border border-input px-4 py-2 text-sm font-medium hover:bg-accent transition-colors'
            >
              {t('retry')}
            </button>
          </div>
        )}

        {hasQuery && !hasError && !hasResults && (
          <div className='flex flex-col items-center gap-3 py-16 text-center'>
            <SearchX className='w-10 h-10 opacity-40 text-muted-foreground' />
            <p className='text-muted-foreground'>
              {t('noResults')} “{initialQuery}”
            </p>
            <p className='text-sm text-muted-foreground'>
              {t('noResultsHint')}
            </p>
          </div>
        )}

        {hasQuery && !hasError && hasResults && (
          <div className='space-y-4'>
            <p className='text-sm text-muted-foreground'>
              {t('resultsCount', { count: initialResult.total })}
            </p>
            <SearchResults songs={initialResult.songs} query={initialQuery} />
          </div>
        )}
      </div>
    </main>
  )
}
