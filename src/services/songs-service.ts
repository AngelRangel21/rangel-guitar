"use server";

import { supabase } from "@/lib/supabase";
import type { Song } from "@/lib/types";
import { createSlug } from "@/lib/utils";

/**
 * Mapea un objeto de Supabase a un objeto Song, generando el slug si no existe.
 * @param {Partial<Song>} data - El objeto de datos de Supabase.
 * @returns {Song} - El objeto canción.
 */
const mapDataToSong = (data: Partial<Song>): Song => {
  if (!data.title || !data.artist) {
    throw new Error("Datos de canción incompletos");
  }

  return {
    ...data,
    slug: data.slug || createSlug(data.title, data.artist),
    // Aseguramos que las propiedades obligatorias existan
    id: data.id!,
    title: data.title,
    artist: data.artist,
    // ... mapear otras propps si es necesario
  } as Song;
};

/**
 * Obtiene todas las canciones de la base de datos.
 * @returns {Promise<Song[]>} - Un array con todas las canciones.
 */
export async function getSongs(): Promise<Song[]> {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("title", { ascending: true });
  if (error) {
    console.error("Error al obtener las canciones:", error);
    return [];
  }
  return data || [];
}

/**
 * Busca una canción por su slug de forma eficiente.
 * @param {string} slug - El slug de la canción a buscar.
 * @returns {Promise<Song | null>} - La canción encontrada o null si no existe.
 */
export async function getSongBySlug(slug: string): Promise<Song | null> {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("slug", slug)
    .limit(1)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null; // No rows found
    throw error;
  }
  return mapDataToSong(data);
}

/**
 * Obtiene una canción por su ID de documento.
 * @param {string} id - El ID de la canción.
 * @returns {Promise<Song | null>} - La canción encontrada o null.
 */
export async function getSongById(id: string): Promise<Song | null> {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null; // No rows found
    throw error;
  }
  return mapDataToSong(data);
}

/**
 * Obtiene todas las canciones de un artista específico.
 * @param {string} artistName - El nombre del artista.
 * @returns {Promise<Song[]>} - Un array con las canciones del artista.
 */
export async function getSongsByArtist(artistName: string): Promise<Song[]> {
  if (!artistName) return [];

  try {
    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .eq("artist", artistName);

    if (error) {
      console.error("Error fetching songs:", error);
      return [];
    }

    return data ? data.map(mapDataToSong) : [];
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in getSongsByArtist:", error.message);
    } else {
      console.error("Unknown error in getSongsByArtist:", error);
    }
    return [];
  }
}

/**
 * Obtiene una lista de todos los nombres de artistas únicos a partir de la colección de canciones.
 * @returns {Promise<string[]>} - Un array con los nombres de todos los artistas.
 */
export async function getArtists(): Promise<string[]> {
  const { data, error } = await supabase.from("songs").select("artist");
  if (error) throw error;
  const artistNames = new Set(data.map((song) => song.artist));
  return Array.from(artistNames);
}

/**
 * Obtiene las canciones más populares según un campo específico (visitas o "me gusta").
 * @param {'visitCount' | 'likeCount'} field - El campo por el cual ordenar.
 * @param {number} count - El número de canciones a obtener.
 * @returns {Promise<Song[]>} - Un array con las canciones más populares.
 */
export async function getTopSongsBy(
  field: "visitCount" | "likeCount",
  count: number
): Promise<Song[]> {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order(field, { ascending: false })
    .limit(count);
  if (error) throw error;
  return data.map(mapDataToSong);
}
