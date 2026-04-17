// services/search.service.ts
/** biome-ignore-all lint/complexity/noStaticOnlyClass: explain */

import { supabase } from '@/lib/supabase'
import type { SearchResult, Song } from '@/lib/types'

const SEARCH_LIMIT = 10
const MIN_QUERY_LENGTH = 2

export class SearchService {
  /**
   * Busca canciones por título y/o artista en Supabase.
   * Usa ilike para búsqueda case-insensitive.
   * Ajusta 'songs' al nombre real de tu tabla.
   */
  static async search(query: string): Promise<SearchResult> {
    const trimmed = query.trim()

    if (trimmed.length < MIN_QUERY_LENGTH) {
      return { songs: [], total: 0 }
    }

    const pattern = `%${trimmed}%`

    const { data, error, count } = await supabase
      .from('songs')
      .select('id, slug, title, artist, "coverArt"', { count: 'exact' })
      .or(`title.ilike.${pattern},artist.ilike.${pattern}`)
      .order('title', { ascending: true })
      .limit(SEARCH_LIMIT)

    if (error != null) throw new Error(error.message)

    return {
      songs: (data as Song[]) ?? [],
      total: count ?? 0
    }
  }

  /**
   * Búsqueda solo por artista (para autocompletar artistas únicos)
   */
  static async searchByArtist(query: string): Promise<Array<string | null>> {
    const trimmed = query.trim()

    if (trimmed.length < MIN_QUERY_LENGTH) return []

    const { data, error } = await supabase
      .from('songs')
      .select('artist')
      .ilike('artist', `%${trimmed}%`)
      .order('artist', { ascending: true })
      .limit(5)

    if (error != null) throw new Error(error.message)

    // Retornar artistas únicos
    const unique: Array<string | null> = [
      ...new Set((data ?? []).map((d: { artist: string | null }) => d.artist))
    ]
    return unique || null
  }
}
