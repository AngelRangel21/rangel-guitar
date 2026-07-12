'use server'

import { adminCheck } from '@/app/[locale]/admin/artists/[slug]/edit/actions'
import { supabaseServer } from '@/lib/supabase/server'
import type { SongRequest } from '@/lib/types'

/**
 * Interfaz para los datos de entrada al crear una nueva solicitud de canción.
 */
export interface SongRequestInput {
  title: string
  artist: string
}

/**
 * Obtiene todas las solicitudes de canciones, ordenadas por fecha descendente.
 * ESTA FUNCIÓN ES PARA USO EXCLUSIVO DEL LADO DEL SERVIDOR (Server Components / Route Handlers)
 * porque asume que los permisos ya han sido validados.
 * @returns {Promise<SongRequest[]>} Una promesa que se resuelve con un array de solicitudes de canciones.
 */
export async function getSongRequestsForServer(): Promise<SongRequest[]> {
  const supabase = await supabaseServer()
  await adminCheck(supabase)
  const { data, error } = await supabase
    .from('songs_requests')
    .select('*')
    .order('requestedAt', { ascending: false })

  if (error) {
    console.error('Error fetching song requests:', error)
    throw new Error('Could not fetch song requests.')
  }

  return data.map((req) => ({
    ...req,
    requestedAt: new Date(req.requestedAt)
  }))
}
