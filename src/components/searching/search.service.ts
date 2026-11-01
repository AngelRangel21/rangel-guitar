// services/search.service.ts
/** biome-ignore-all lint/complexity/noStaticOnlyClass: explain */

import type { SearchResult } from '@/components/searching/search.types'
import {
  MIN_QUERY_LENGTH,
  sanitizeTerm
} from '@/components/searching/search.utils'
import { supabase } from '@/lib/supabase'

/** Resultados que muestra el dropdown del buscador. */
export const SEARCH_LIMIT = 10

/** Resultados que muestra la página de búsqueda. */
export const SEARCH_PAGE_LIMIT = 24

/**
 * Canciones que se traen al resolver los artistas que coinciden. Es mayor que
 * el límite de resultados porque un artista puede tener muchas canciones y
 * solo necesitamos sus IDs para el segundo filtro.
 */
const ARTIST_MATCH_LIMIT = 200

interface SearchOptions {
  /** Número máximo de resultados a devolver. */
  limit?: number
}

export class SearchService {
  /**
   * Busca canciones por título y/o nombre de artista en Supabase.
   * `songs` no tiene columna `artist`: los artistas viven en `artists` y se
   * relacionan mediante `songs_artists`, así que primero resolvemos los IDs
   * de canciones cuyos artistas coinciden y luego consultamos `songs` por
   * título o por esos IDs. Usa `ilike` para búsqueda case-insensitive.
   */
  static async search(
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResult> {
    const limit = options.limit ?? SEARCH_LIMIT
    const trimmed = sanitizeTerm(query)

    if (trimmed.length < MIN_QUERY_LENGTH) {
      return { songs: [], total: 0 }
    }

    const pattern = `%${trimmed}%`

    const { data: links, error: linksErrors } = await supabase
      .from('songs_artists')
      .select('song_id, artist:artists!inner(name)')
      .ilike('artist.name', pattern)
      .limit(ARTIST_MATCH_LIMIT)

    if (linksErrors != null) throw new Error(linksErrors.message)

    const artistSongIds = [...new Set((links ?? []).map((l) => l.song_id))]

    const orFilter = [
      `title.ilike.${pattern}`,
      artistSongIds.length > 0 ? `id.in.(${artistSongIds.join(',')})` : null
    ]
      .filter(Boolean)
      .join(',')

    const { data, error, count } = await supabase
      .from('songs')
      .select(
        'id, slug, title, "coverArt", artists_list:songs_artists(artist:artists(name))',
        { count: 'exact' }
      )
      .or(orFilter)
      .order('title', { ascending: true })
      .limit(limit)

    if (error != null) throw new Error(error.message)

    return {
      songs: (data ?? []).map((song) => ({
        id: song.id,
        slug: song.slug ?? '',
        title: song.title ?? '',
        coverArt: song.coverArt,
        artist:
          song.artists_list
            ?.map((item) => item.artist?.name)
            .filter(Boolean)
            .join(', ') || 'Artista desconocido'
      })),
      total: count ?? 0
    }
  }
}
