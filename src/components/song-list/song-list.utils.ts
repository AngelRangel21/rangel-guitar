import type { SongWithArtist } from '@/types/app.types'
import type { SongListSort } from './song-list.types'

/** Número de canciones a mostrar por página. */
export const SONGS_PER_PAGE = 16

/** Páginas intermedias visibles alrededor de la actual en la paginación. */
const MAX_PAGES_TO_SHOW = 3

/**
 * Ordena las canciones sin mutar el array original.
 * `recent` respeta el orden de entrada (el servicio ya las trae por fecha).
 */
export function sortSongs(
  songs: SongWithArtist[],
  sort: SongListSort
): SongWithArtist[] {
  if (sort === 'recent') return songs
  return [...songs].sort((a, b) =>
    (a.title ?? '').localeCompare(b.title ?? '', undefined, {
      sensitivity: 'base'
    })
  )
}

/** Total de páginas; siempre al menos 1. */
export function getTotalPages(
  total: number,
  perPage: number = SONGS_PER_PAGE
): number {
  return Math.max(1, Math.ceil(total / perPage))
}

/**
 * Páginas intermedias a mostrar (sin contar la primera ni la última, que la
 * paginación siempre pinta).
 */
export function getMiddlePages(
  currentPage: number,
  totalPages: number
): number[] {
  const halfMaxPages = Math.floor(MAX_PAGES_TO_SHOW / 2)

  let startPage = Math.max(2, currentPage - halfMaxPages)
  let endPage = Math.min(totalPages - 1, currentPage + halfMaxPages)

  if (currentPage <= MAX_PAGES_TO_SHOW) {
    startPage = 2
    endPage = Math.min(totalPages - 1, MAX_PAGES_TO_SHOW)
  }

  if (currentPage > totalPages - MAX_PAGES_TO_SHOW) {
    startPage = Math.max(2, totalPages - MAX_PAGES_TO_SHOW)
    endPage = totalPages - 1
  }

  const pages: number[] = []
  for (let page = startPage; page <= endPage; page++) pages.push(page)
  return pages
}
