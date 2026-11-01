import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { JSX } from 'react'
import { z } from 'zod'
import {
  SEARCH_PAGE_LIMIT,
  SearchService
} from '@/components/searching/search.service'
import type { SearchResult } from '@/components/searching/search.types'
import { normalizeQuery } from '@/components/searching/search.utils'
import { SearchPageContent } from '@/components/searching/search-page-content'

const searchParamsSchema = z.object({
  q: z.preprocess(
    (value) => (Array.isArray(value) ? value[0] : value),
    z.string().max(80).optional()
  )
})

interface SearchPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string | string[] }>
}

/** Lee y normaliza `?q=` sin lanzar si el parámetro viene mal formado. */
async function getQuery(searchParams: SearchPageProps['searchParams']) {
  const parsed = searchParamsSchema.safeParse(await searchParams)
  return parsed.success ? normalizeQuery(parsed.data.q) : ''
}

export async function generateMetadata({
  params,
  searchParams
}: SearchPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'searchPage' })
  const query = await getQuery(searchParams)

  return {
    title: query ? `${query} — ${t('title')}` : t('title'),
    description: t('description'),
    // Las páginas de resultados no aportan contenido propio: se evita que
    // Google indexe infinitas variantes de `?q=`.
    robots: { index: false, follow: true }
  }
}

export default async function SearchPage({
  params,
  searchParams
}: SearchPageProps): Promise<JSX.Element> {
  const { locale } = await params
  setRequestLocale(locale)

  const query = await getQuery(searchParams)

  let result: SearchResult = { songs: [], total: 0 }
  let hasError = false

  if (query) {
    try {
      result = await SearchService.search(query, { limit: SEARCH_PAGE_LIMIT })
    } catch (error) {
      console.error('[SearchPage] Error al buscar:', error)
      hasError = true
    }
  }

  return (
    <SearchPageContent
      initialQuery={query}
      initialResult={result}
      hasError={hasError}
    />
  )
}
