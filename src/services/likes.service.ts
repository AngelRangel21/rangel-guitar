import { supabase } from '@/lib/supabase'
import type { ToggleLikeResult } from '@/types/app.types'

/**
 * Devuelve los IDs de las canciones a las que el usuario ha dado "me gusta".
 * @param userId - UID del usuario.
 */
export async function getLikedSongIds(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('song_likes')
    .select('song_id')
    .eq('user_id', userId)

  if (error != null) throw error

  return new Set(data.map((row) => row.song_id))
}

/**
 * Indica si el usuario ya dio "me gusta" a una canción.
 * @param songId - ID de la canción.
 * @param userId - UID del usuario.
 */
export async function hasLikedSong(
  songId: string,
  userId: string
): Promise<boolean> {
  const { count, error } = await supabase
    .from('song_likes')
    .select('id', { count: 'exact', head: true })
    .eq('song_id', songId)
    .eq('user_id', userId)

  if (error != null) throw error

  return (count ?? 0) > 0
}

/**
 * Número total de "me gusta" de una canción.
 * @param songId - ID de la canción.
 */
export async function getSongLikeCount(songId: string): Promise<number> {
  const { count, error } = await supabase
    .from('song_likes')
    .select('id', { count: 'exact', head: true })
    .eq('song_id', songId)

  if (error != null) throw error

  return count ?? 0
}

/**
 * Da o quita el "me gusta" de una canción (RPC `toggle_song_like`).
 * @param songId - ID de la canción.
 * @param userId - UID del usuario.
 * @returns `{ liked }` con el estado final.
 */
export async function toggleSongLike(
  songId: string,
  userId: string
): Promise<ToggleLikeResult> {
  const { data, error } = await supabase.rpc('toggle_song_like', {
    p_song_id: songId,
    p_user_id: userId
  })

  if (error != null) throw error

  return data as unknown as ToggleLikeResult
}
