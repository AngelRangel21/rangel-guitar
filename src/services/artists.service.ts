import { supabase } from '@/lib/supabase'
import { getSongsByIds } from '@/services/song.service'
import type { Artist, ArtistCount, SongWithArtist } from '@/types/app.types'

export async function getArtists(): Promise<ArtistCount[]> {
  const { data, error } = await supabase
    .from('artists')
    .select('*, song_count:songs_artists(count)')
    .order('name', { ascending: true })

  if (error != null) throw error

  return (
    data?.map((artist) => ({
      ...artist,
      count: artist.song_count[0]?.count || 0
    })) ?? []
  )
}

export async function getSongsByArtistSlug(
  slug: string
): Promise<SongWithArtist[]> {
  if (!slug) return []

  // 1. Obtener artista
  const { data: artist, error: artistError } = await supabase
    .from('artists')
    .select('id')
    .eq('slug', slug)
    .single()

  if (artistError || !artist) {
    console.error('Artist not found:', slug)
    return []
  }

  // 2. Obtener canciones (relación directa)
  const { data: songLink, error: linkError } = await supabase
    .from('songs_artists')
    .select('song_id')
    .eq('artist_id', artist.id)

  if (linkError != null || !songLink) {
    console.error('Error fetching songs:', linkError)
    return []
  }

  try {
    return await getSongsByIds(songLink.map((link) => link.song_id))
  } catch (error) {
    console.error('Error fetching songs:', error)
    return []
  }
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error != null || !data) return null

  return data
}

export function getArtistImage(path: string) {
  const { data } = supabase.storage.from('artist-image').getPublicUrl(path)

  return data.publicUrl
}

/**
 * Busca artistas cuyo nombre contenga el texto (sin distinguir mayúsculas).
 * @param query - Texto a buscar.
 * @param limit - Número máximo de resultados.
 */
export async function searchArtists(
  query: string,
  limit = 10
): Promise<Artist[]> {
  const term = query.trim()
  if (term === '') return []

  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .ilike('name', `%${term.replace(/[%_]/g, '\\$&')}%`)
    .order('name', { ascending: true })
    .limit(limit)

  if (error != null) throw error

  return data
}

/**
 * Artistas asociados a una canción.
 * @param songId - ID de la canción.
 */
export async function getArtistsBySongId(songId: string): Promise<Artist[]> {
  const { data, error } = await supabase
    .from('songs_artists')
    .select('artist:artists(*)')
    .eq('song_id', songId)

  if (error != null) throw error

  return data.map((row) => row.artist).filter((a): a is Artist => a != null)
}
