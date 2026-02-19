// IMPORTANTE: Este archivo está destinado a operaciones del lado del cliente y NO debe tener la directiva 'use server'.
import { supabase } from '@/lib/supabase';

/**
 * Interfaz para los datos de entrada de una nueva solicitud de canción.
 */
export interface SongRequestInput {
  title: string;
  artist: string;
  user_id: string
}

/**
 * Agrega una nueva solicitud de canción a la base de datos.
 * @param {SongRequestInput} request - Los datos de la solicitud.
 */
export async function addSongRequest(request: SongRequestInput): Promise<void> {
    const { error } = await supabase.from('songs_requests').insert({
        title: request.title,
        artist: request.artist,
        user_id: request.user_id
    });
    if (error != null) throw error;
}

/**
 * Elimina una solicitud de canción de la base de datos por su ID.
 * @param {string} id - El ID del documento de la solicitud a eliminar.
 */
export async function deleteSongRequest(id: string): Promise<void> {
    const { error } = await supabase.from('songs_requests').delete().eq('id', id);
    if (error) throw error;
}
