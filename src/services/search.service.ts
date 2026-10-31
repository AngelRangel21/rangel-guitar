// services/search.service.ts
/** biome-ignore-all lint/complexity/noStaticOnlyClass: explain */

import { supabase } from '@/lib/supabase'
import type { SearchResult } from '@/types/search.types'

const SEARCH_LIMIT = 10
const MIN_QUERY_LENGTH = 2

export class SearchService {
  /**
   * Busca canciones por título y/o nombre de artista en Supabase.
   * `songs` no tiene columna `artist`: los artistas viven en `artists` y se
   * relacionan mediante `songs_artists`, así que primero resolvemos los IDs
   * de canciones cuyos artistas coinciden y luego consultamos `songs` por
   * título o por esos IDs. Usa `ilike` para búsqueda case-insensitive.
   */
  static async search(query: string): Promise<SearchResult> {
    const trimmed = query.trim()

    if (trimmed.length < MIN_QUERY_LENGTH) {
      return { songs: [], total: 0 }
    }

    const pattern = `%${trimmed}%`

    const { data: links, error: linksErrors } = await supabase
      .from('songs_artists')
      .select('song_id, artist:artists!inner(name)')
      .ilike('artist.name', pattern)
      .limit(SEARCH_LIMIT)

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
      .limit(SEARCH_LIMIT)

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
