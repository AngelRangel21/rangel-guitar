import { supabase } from '@/lib/supabase'
import type {
  DbSongRequest,
  NewSongRequest,
  SongRequestStatus
} from '@/types/app.types'

/**
 * Operaciones de `songs_requests` desde el cliente. La versión de servidor
 * (con comprobación de admin) está en `requests-service.ts`.
 */

/** Todas las solicitudes, de la más reciente a la más antigua (admin). */
export async function getSongRequests(): Promise<DbSongRequest[]> {
  const { data, error } = await supabase
    .from('songs_requests')
    .select('*')
    .order('requestedAt', { ascending: false })

  if (error != null) throw error

  return data
}

/**
 * Solicitudes hechas por un usuario.
 *
 * Requiere la migración `harden_rls_and_functions`, que añade la política
 * `requests_select_own_or_admin`.
 * @param userId - UID del usuario.
 */
export async function getUserSongRequests(
  userId: string
): Promise<DbSongRequest[]> {
  const { data, error } = await supabase
    .from('songs_requests')
    .select('*')
    .eq('user_id', userId)
    .order('requestedAt', { ascending: false })

  if (error != null) throw error

  return data
}

/**
 * Número de solicitudes con un estado (por defecto, pendientes).
 * @param status - Estado a contar.
 */
export async function getSongRequestCount(
  status: SongRequestStatus = 'pending'
): Promise<number> {
  const { count, error } = await supabase
    .from('songs_requests')
    .select('id', { count: 'exact', head: true })
    .eq('status', status)

  if (error != null) throw error

  return count ?? 0
}

/**
 * Crea una solicitud de canción.
 *
 * No pide la fila de vuelta (`.select()`): sin la migración
 * `harden_rls_and_functions` solo los admin pueden leer `songs_requests` y
 * PostgREST rechazaría el insert para el resto.
 * @param userId - UID de quien la pide.
 * @param request - Título y artista.
 */
export async function createSongRequest(
  userId: string,
  { title, artist }: NewSongRequest
): Promise<void> {
  const { error } = await supabase
    .from('songs_requests')
    .insert({ title: title.trim(), artist: artist.trim(), user_id: userId })

  if (error != null) throw error
}

/**
 * Cambia el estado de una solicitud y, opcionalmente, deja una nota (admin).
 * @param id - ID de la solicitud.
 * @param status - Nuevo estado.
 * @param adminNote - Nota visible para quien la pidió.
 */
export async function updateSongRequestStatus(
  id: string,
  status: SongRequestStatus,
  adminNote?: string | null
): Promise<void> {
  const { error } = await supabase
    .from('songs_requests')
    .update({
      status,
      ...(adminNote !== undefined && { adminNote })
    })
    .eq('id', id)

  if (error != null) throw error
}

/**
 * Elimina una solicitud.
 * @param id - ID de la solicitud.
 */
export async function deleteSongRequest(id: string): Promise<void> {
  const { error } = await supabase.from('songs_requests').delete().eq('id', id)

  if (error != null) throw error
}

/**
 * Escucha en tiempo real cualquier cambio en `songs_requests`.
 * @param channelName - Nombre único del canal (uno por componente montado).
 * @param onChange - Se llama en cada inserción, edición o borrado.
 * @returns Función que cancela la suscripción.
 */
export function subscribeToSongRequests(
  channelName: string,
  onChange: () => void
): () => void {
  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'songs_requests' },
      onChange
    )
    .subscribe()

  return () => {
    channel.unsubscribe()
    supabase.removeChannel(channel)
  }
}
