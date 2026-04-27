/** biome-ignore-all lint/suspicious/noExplicitAny: explain */
import { supabase } from '@/lib/supabase'
import type { ArtistCount, SongWithArtist } from '@/types/app.types'

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

  const songIds = songLink.map((link) => link.song_id)

  const { data, error } = await supabase
    .from('songs_2')
    .select(`
      *,
      artists_list:songs_artists (
        artist:artists (*)
        )
      `)
    .in('id', songIds)
    .eq('isPublished', true)
    .order('title', { ascending: true })

  if (error != null || !data) {
    console.error('Error fetching songs:', linkError)
    return []
  }

  return data.map((song) => ({
    ...song,
    artists: ((song.artists_list as any[]) || []).map((item) => item.artist)
  })) as SongWithArtist[]
}

export function getArtistImage(path: string) {
  const { data } = supabase.storage.from('artist-image').getPublicUrl(path)

  return data.publicUrl
}
