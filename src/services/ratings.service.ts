import { supabase } from '@/lib/supabase'
import type { SongRatingSummary } from '@/types/app.types'

/**
 * Media y número de valoraciones de una canción (RPC `get_song_rating`,
 * pública: solo devuelve agregados).
 * @param songId - ID de la canción.
 */
export async function getSongRatingSummary(
  songId: string
): Promise<SongRatingSummary> {
  const { data, error } = await supabase.rpc('get_song_rating', {
    p_song_id: songId
  })

  if (error != null) throw error

  const [row] = data
  return {
    average: Number(row?.average ?? 0),
    total: Number(row?.total ?? 0)
  }
}

/**
 * Valoración (1-5) que el usuario dio a una canción, o `null` si no la ha
 * valorado.
 * @param songId - ID de la canción.
 * @param userId - UID del usuario.
 */
export async function getUserSongRating(
  songId: string,
  userId: string
): Promise<number | null> {
  const { data, error } = await supabase
    .from('song_ratings')
    .select('rating')
    .eq('song_id', songId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error != null) throw error

  return data?.rating ?? null
}

/**
 * Guarda o cambia la valoración del usuario (una por canción).
 * @param songId - ID de la canción.
 * @param userId - UID del usuario.
 * @param rating - Estrellas, de 1 a 5.
 */
export async function rateSong(
  songId: string,
  userId: string,
  rating: number
): Promise<void> {
  const { error } = await supabase
    .from('song_ratings')
    .upsert(
      { song_id: songId, user_id: userId, rating },
      { onConflict: 'song_id,user_id' }
    )

  if (error != null) throw error
}

/**
 * Quita la valoración del usuario.
 * @param songId - ID de la canción.
 * @param userId - UID del usuario.
 */
export async function removeSongRating(
  songId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from('song_ratings')
    .delete()
    .eq('song_id', songId)
    .eq('user_id', userId)

  if (error != null) throw error
}
