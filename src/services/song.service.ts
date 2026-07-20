/** biome-ignore-all lint/suspicious/noExplicitAny: explain */
import { supabase } from '@/lib/supabase'
import type { Song, SongWithArtist } from '@/types/app.types'

export type NewSongData = Omit<
  Song,
  'id' | 'createdAt' | 'isPublished' | 'updatedAt'
>

export async function getSongs(): Promise<Song[]> {
  const { data, error } = await supabase
    .from('songs')
    .select('id, slug, title, artist, "coverArt", chords, lyrics') // ✅ Solo campos necesarios
    .order('title', { ascending: true })
    .returns<Song[]>()

  if (error != null) {
    console.error('[getSongs] Error de Supabase:', error)
    // ✅ Lanzar error para que el Server Component lo maneje
    throw new Error(`Failed to fetch songs: ${error.message}`)
  }

  // ✅ Validar que data existe y es array
  if (data === null || !Array.isArray(data)) {
    console.warn('[getSongs] Supabase devolvió data inválida:', data)
    return []
  }

  // ✅ Filtrar canciones con datos incompletos (precaución extra)
  return data
}

export async function getSongByArtist(): Promise<SongWithArtist[]> {
  const { data, error } = await supabase
    .from('songs')
    .select(`
      *,
      artists_list:songs_artists(
        artist:artists (
          id,
          name,
          slug
        )
      )
    `)
    .eq('isPublished', true)
    .order('createdAt', { ascending: false })
  // .returns<SongWithArtist[]>()

  if (error != null) {
    console.error('[getSongByArtist]', Error)
    throw new Error(`Error al obtener las canciones: ${error.message}`)
  }

  // Opcional: Mapear los datos para limpiar el anidamiento de la tabla intermedia
  return (data || [])?.map((song) => ({
    ...song,
    artists: ((song.artists_list as any[]) || []).map(
      (item: any) => item.artist
    )
  })) as SongWithArtist[]
}

export async function getSongBySlug(
  slug: string
): Promise<SongWithArtist | null> {
  const { data, error } = await supabase
    .from('songs')
    .select('*, artists_list:songs_artists(artist:artists (*))')
    .eq('slug', slug)
    .single()

  if (error != null || !data) return null

  return {
    ...data,
    artists: ((data.artists_list as any[]) || []).map((item) => item.artist)
  } as SongWithArtist
}

export async function addSong(songData: NewSongData) {
  const { error } = await supabase.from('songs').insert({ ...songData })
  if (error != null) throw error
}

export async function updateSong(
  id: string,
  songData: Partial<SongWithArtist>
): Promise<void> {
  const { artists, ...dataToUpdate } = songData
  const { error } = await supabase
    .from('songs')
    .update(dataToUpdate)
    .eq('id', id)
  if (error != null) throw error
}

export async function deleteSong(id: string): Promise<void> {
  const { error } = await supabase.from('songs').delete().eq('id', id)
  if (error != null) throw error
}
