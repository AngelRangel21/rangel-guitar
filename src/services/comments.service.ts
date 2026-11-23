import { supabase } from '@/lib/supabase'
import type { DbSongComment, SongComment } from '@/types/app.types'

/**
 * Obtiene los comentarios visibles (no borrados) de una canción, del más
 * antiguo al más reciente, con el nombre y avatar de cada autor (RPC
 * `get_song_comments`, que no expone el email).
 * @param songId - ID de la canción.
 */
export async function getSongComments(songId: string): Promise<SongComment[]> {
  const { data, error } = await supabase.rpc('get_song_comments', {
    p_song_id: songId
  })

  if (error != null) throw error

  return data.map(({ user_name, user_avatar_url, ...comment }) => ({
    ...comment,
    user: { uid: comment.user_id, name: user_name, avatar_url: user_avatar_url }
  }))
}

/**
 * Número de comentarios visibles de una canción.
 * @param songId - ID de la canción.
 */
export async function getSongCommentCount(songId: string): Promise<number> {
  const { count, error } = await supabase
    .from('song_comments')
    .select('id', { count: 'exact', head: true })
    .eq('song_id', songId)
    .eq('isDeleted', false)

  if (error != null) throw error

  return count ?? 0
}

/**
 * Publica un comentario en una canción.
 * @param songId - ID de la canción.
 * @param userId - UID del autor.
 * @param content - Texto del comentario (se recortan los espacios).
 */
export async function addSongComment(
  songId: string,
  userId: string,
  content: string
): Promise<DbSongComment> {
  const { data, error } = await supabase
    .from('song_comments')
    .insert({ song_id: songId, user_id: userId, content: content.trim() })
    .select()
    .single()

  if (error != null) throw error

  return data
}

/**
 * Edita el texto de un comentario.
 * @param id - ID del comentario.
 * @param content - Nuevo texto.
 */
export async function updateSongComment(
  id: string,
  content: string
): Promise<DbSongComment> {
  const { data, error } = await supabase
    .from('song_comments')
    .update({ content: content.trim(), updatedAt: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error != null) throw error

  return data
}

/**
 * Borra un comentario de forma lógica (`isDeleted = true`), para conservar
 * el historial. El RLS (`comments_update_own`) solo lo permite al autor; un
 * admin puede borrarlo del todo con `delete`.
 * @param id - ID del comentario.
 */
export async function deleteSongComment(id: string): Promise<void> {
  const { error } = await supabase
    .from('song_comments')
    .update({ isDeleted: true, updatedAt: new Date().toISOString() })
    .eq('id', id)

  if (error != null) throw error
}

/**
 * Elimina un comentario definitivamente. Solo admin (política
 * `comments_delete_own_or_admin`); el autor usa `deleteSongComment`.
 * @param id - ID del comentario.
 */
export async function deleteSongCommentPermanently(id: string): Promise<void> {
  const { error } = await supabase.from('song_comments').delete().eq('id', id)

  if (error != null) throw error
}
