'use client'

import { MusicIcon, Search as SearchIcon, SearchX } from 'lucide-react'
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
import { EmptyState } from '@/components/layout/empty-state'
import { PageHeader, PageShell } from '@/components/layout/page-header'
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
    <PageShell>
      <PageHeader
        eyebrow={{ icon: SearchIcon, label: t('title') }}
        title={
          hasQuery ? (
            <>
              {t('resultsFor')}{' '}
              <span className='text-muted-foreground'>“{initialQuery}”</span>
            </>
          ) : (
            t('heading')
          )
        }
      >
        <search className='block w-full max-w-2xl' aria-busy={isPending}>
          <form onSubmit={handleSubmit}>
            <SearchInput
              id={inputId}
              size='lg'
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
      </PageHeader>

      <div
        aria-live='polite'
        className={isPending ? 'opacity-60 transition-opacity' : undefined}
      >
        {!hasQuery && <EmptyState icon={MusicIcon} title={t('emptyState')} />}

        {hasQuery && hasError && (
          <EmptyState icon={SearchX} title={t('error')}>
            <button
              type='button'
              onClick={() => nextRouter.refresh()}
              className='inline-flex h-10 items-center rounded-full border px-5 text-sm font-semibold transition-colors hover:bg-muted'
            >
              {t('retry')}
            </button>
          </EmptyState>
        )}

        {hasQuery && !hasError && !hasResults && (
          <EmptyState
            icon={SearchX}
            title={`${t('noResults')} “${initialQuery}”`}
            description={t('noResultsHint')}
          />
        )}

        {hasQuery && !hasError && hasResults && (
          <div className='space-y-4'>
            <p className='border-b pb-3 text-sm text-muted-foreground'>
              {t('resultsCount', { count: initialResult.total })}
            </p>
            <SearchResults songs={initialResult.songs} query={initialQuery} />
          </div>
        )}
      </div>
    </PageShell>
  )
}
