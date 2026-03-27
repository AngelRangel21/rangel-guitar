import { supabase } from '@/lib/supabase'
import type { ArtistCount, SongWithArtist } from '@/types/app.types'

export async function getArtists (): Promise<ArtistCount[]> {
  const { data, error } = await supabase
    .from('artists')
    .select('*, song:songs_artists(songs:songs_2(id))')
    .order('name', { ascending: true })

  if (error != null) throw error

  return data?.map(artist => ({
    ...artist,
    count: artist.song.length
  })) ?? []
}

export async function getSongsByArtistSlug(slug: string): Promise<SongWithArtist[]> {
  if (!slug) return []

  // 1. Obtener artista
  const { data: artist, error: artistError } = await supabase
    .from('artists')
    .select('id, name')
    .eq('slug', slug)
    .single()

  // 2. Obtener canciones (relación directa)
  const { data, error } = await supabase
    .from('songs_2')
    .select(`
      *,
      artist:artists(*)
    `)
    .eq('artist_id', artist.id)
    .eq('isPublished', true)

  if (error != null) {
    console.error('Error fetching songs:', error)
    return []
  }

  return data ?? []
}

export function getArtistImage (path: string) {
  const { data } = supabase
    .storage
    .from('artist-image')
    .getPublicUrl(path)

  return data.publicUrl
}
