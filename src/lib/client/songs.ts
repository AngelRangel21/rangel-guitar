// IMPORTANTE: Este archivo está destinado a operaciones del lado del cliente y NO debe tener la directiva 'use server'.
import { supabase } from "@/lib/supabase";
import type { Song } from "@/lib/types";

// Tipo para agregar una nueva canción, sin los campos generados por la base de datos (id, contadores).
export type NewSongData = Omit<Song, "id" | "visitCount" | "likeCount">;

/**
 * Agrega una nueva canción a la base de datos.
 * @param {NewSongData} songData - Los datos de la nueva canción.
 */
export async function addSong(songData: NewSongData): Promise<void> {
  const { error } = await supabase.from("songs").insert({
    ...songData,
    visitCount: 0, // Inicializa los contadores.
    likeCount: 0,
  });
  if (error) throw error;
}

/**
 * Actualiza los datos de una canción existente en la base de datos.
 * @param {string} id - El ID de la canción a actualizar.
 * @param {Partial<NewSongData>} songData - Los campos de la canción a actualizar.
 */
export async function updateSong(
  id: string,
  songData: Partial<NewSongData>
): Promise<void> {
  const { error } = await supabase
    .from("songs")
    .update(songData)
    .eq("id", id);
  if (error) throw error;
}

/**
 * Elimina una canción de la base de datos por su ID.
 * @param {string} id - El ID de la canción a eliminar.
 */
export async function deleteSong(id: string): Promise<void> {
  const { error } = await supabase.from("songs").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Incrementa el contador de visitas de una canción en 1.
 * @param {string} id - El ID de la canción visitada.
 */
export async function incrementVisitCount(id: string): Promise<void> {
  const { error } = await supabase.rpc("increment_song_counter", {
    song_id: id,
    field_name: "visitCount",
    increment_value: 1,
  });
  if (error) throw error;
}

/**
 * Actualiza el contador de "me gusta" de una canción.
 * @param {string} id - El ID de la canción.
 * @param {1 | -1} delta - El valor a sumar (1 para "me gusta", -1 para "no me gusta").
 */
export async function updateLikeCount(
  id: string,
  delta: 1 | -1
): Promise<void> {
  const { error } = await supabase.rpc("increment_song_counter", {
    song_id: id,
    field_name: "likeCount",
    increment_value: delta,
  });
  if (!error) throw error;
}
