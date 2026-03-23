import { supabase } from '@/lib/supabase'
import type { ArtistCount, SongWithArtist } from '@/types/app.types'

export async function getArtists(): Promise<ArtistCount[]> {
  const { data, error } = await supabase
    .from('artists')
    .select('*, songs_2(count)')
    .order('name', { ascending: true })

  if (error) throw error

  return data ?? []
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
