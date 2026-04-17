/** biome-ignore-all lint/complexity/noStaticOnlyClass: explain */
import { supabase } from '@/lib/supabase'

export class FavoriteService {
  static async loadFavoriteIds(uid: string): Promise<Set<string>> {
    const { data, error } = await supabase
      .from('song_favorites')
      .select('song_id')
      .eq('user_id', uid)

    if (error != null) throw error

    return new Set(data.map((row) => row.song_id))
  }

  static async toggleFavorite(
    songId: string,
    userId: string
  ): Promise<{ favorited: boolean }> {
    const { data, error } = await supabase.rpc('toggle_song_favorite', {
      p_song_id: songId,
      p_user_id: userId
    })

    if (error != null) {
      console.error('Error en RPC toggle_favorite:', error)
      throw error
    }

    return data as { favorited: boolean }
  }

  static isFavorite(songId: string, favoriteIds: Set<string>): boolean {
    return favoriteIds.has(songId)
  }
}
