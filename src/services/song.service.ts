import { supabase } from '@/lib/supabase'
import { Song } from '@/types'

export async function getSongs (): Promise<Song[]> {
  const { data, error } = await supabase
    .from('songs')
    .select('id, slug, title, artist, "coverArt", chords, lyrics') // ✅ Solo campos necesarios
    .order('title', { ascending: true })

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
  return data.filter((song): song is Song => {
    const isValid =
      typeof song.id === 'string' &&
      typeof song.slug === 'string' &&
      typeof song.title === 'string' &&
      typeof song.artist === 'string'

    if (!isValid) {
      console.warn('[getSongs] Canción con datos incompletos ignorada:', song)
    }

    return isValid
  })
}
