import { supabase } from '@/lib/supabase'

interface RegisterVisitOptions {
  /** UID del usuario, si ha iniciado sesión. */
  userId?: string | null
  /** Hash de la IP para contar visitantes anónimos sin guardar la IP. */
  ipHash?: string | null
}

/**
 * Registra una visita a una canción en `song_visits`.
 * @param songId - ID de la canción visitada.
 */
export async function registerSongVisit(
  songId: string,
  { userId = null, ipHash = null }: RegisterVisitOptions = {}
): Promise<void> {
  const { error } = await supabase
    .from('song_visits')
    .insert({ song_id: songId, user_id: userId, ip_hash: ipHash })

  if (error != null) throw error
}
