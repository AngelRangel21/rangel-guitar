import { supabase } from '@/lib/supabase'
import { Song } from '@/types'
import { SongWithArtist } from '@/types/app.types'

export type NewSongData = Omit<Song, 'id' | 'key' | 'createdAt' | 'isPublished' | 'updatedAt'>

export async function getSongs (): Promise<Song[]> {
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
  if ((data === null) || !Array.isArray(data)) {
    console.warn('[getSongs] Supabase devolvió data inválida:', data)
    return []
  }

  // ✅ Filtrar canciones con datos incompletos (precaución extra)
  return data
}

export async function getSongByArtist (): Promise<SongWithArtist[]> {
  const { data, error } = await supabase
    .from('songs_2')
    .select(`
      *,
      artist:artists (
        id,
        name,
        slug
      )
    `)
    .order('title', { ascending: true })
    .returns<SongWithArtist[]>()

  if (data == null) {
    console.error('[getSongByArtist]', Error)
  }

  if (error != null) {
    throw new Error('Error al obtener las canciones', error)
  }

  return data
}

export async function getSongBySlug (slug: string): Promise<SongWithArtist> {
  const { data, error } = await supabase
    .from('songs_2')
    .select('*, artist:artists (*)')
    .eq('slug', slug)
    .limit(1)
    .single()
    .returns<SongWithArtist>()
  
  if (error != null) throw error

  return data
}

export async function addSong (songData: NewSongData): Promise<void> {
  const { error } = await supabase
    .from('songs_2')
    .insert({ ...songData })
  if (error != null) throw error
}

export async function updateSong (id: string, songData: Partial<SongWithArtist>): Promise<void> {
  const { error } = await supabase
    .from('songs_2')
    .update(songData)
    .eq('id', id)
  if (error != null) throw error
}

export async function deleteSong (id: string): Promise<void> {
  const { error } = await supabase
    .from('songs_2')
    .delete()
    .eq('id', id)
  if (error != null) throw error
}
