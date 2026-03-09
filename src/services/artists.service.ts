import { supabase } from '@/lib/supabase'
import type { ArtistCount } from '@/types/app.types'

export async function getArtists(): Promise<ArtistCount[]> {
  const { data, error } = await supabase
    .from('artists')
    .select('*, songs_2(count)')
    .order('name', { ascending: true })

  if (error) throw error

  return data ?? []
}

export function getArtistImage (path: string) {
  const { data } = supabase
    .storage
    .from('artist-image')
    .getPublicUrl(path)
  
  return data.publicUrl
}