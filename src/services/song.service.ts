import { supabase } from '@/lib/supabase'
import type { DbSongWithCounts, Song, SongWithArtist } from '@/types/app.types'

export type NewSongData = Omit<
  Song,
  'id' | 'createdAt' | 'isPublished' | 'updatedAt' | 'alphatex_content'
> &
  Partial<Pick<Song, 'alphatex_content'>>

/** `select` de una canción con sus artistas (tabla intermedia `songs_artists`). */
const SONG_WITH_ARTISTS_SELECT =
  '*, artists_list:songs_artists(artist:artists(id, name, slug))' as const

type SongArtist = SongWithArtist['artists'][number]

interface SongWithArtistsRow extends Song {
  artists_list: Array<{ artist: SongArtist | null }> | null
}

/** Aplana `artists_list` (filas de `songs_artists`) en `artists`. */
function toSongWithArtist({
  artists_list,
  ...song
}: SongWithArtistsRow): SongWithArtist {
  return {
    ...song,
    artists: (artists_list ?? []).flatMap(({ artist }) =>
      artist != null ? [artist] : []
    )
  }
}

/** Canciones publicadas con sus artistas, de la más reciente a la más antigua. */
export async function getSongByArtist(): Promise<SongWithArtist[]> {
  const { data, error } = await supabase
    .from('songs')
    .select(SONG_WITH_ARTISTS_SELECT)
    .eq('isPublished', true)
    .order('createdAt', { ascending: false })
    .returns<SongWithArtistsRow[]>()

  if (error != null) {
    console.error('[getSongByArtist]', error)
    throw new Error(`Error al obtener las canciones: ${error.message}`)
  }

  return data.map(toSongWithArtist)
}

/**
 * Canción por su slug, con sus artistas, o `null` si no existe.
 * @param slug - Slug de la canción.
 */
export async function getSongBySlug(
  slug: string
): Promise<SongWithArtist | null> {
  const { data, error } = await supabase
    .from('songs')
    .select(SONG_WITH_ARTISTS_SELECT)
    .eq('slug', slug)
    .returns<SongWithArtistsRow[]>()
    .maybeSingle()

  if (error != null || data == null) return null

  return toSongWithArtist(data)
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

// ─────────────────────────────────────────────
// CONTADORES (view songs_with_counts)
// ─────────────────────────────────────────────

/** Contadores públicos de una canción. */
export interface SongStats {
  likes: number
  favorites: number
  comments: number
  visits: number
}

/** Columna de la view por la que ordenar las canciones populares. */
export type SongPopularityField =
  | 'visit_count'
  | 'like_count'
  | 'favorite_count'
  | 'comment_count'

/**
 * Obtiene los contadores (likes, favoritos, comentarios y visitas) de una
 * canción con el RPC `get_song_stats`, que cuenta todas las filas aunque el
 * RLS oculte las visitas y los favoritos de otros usuarios.
 * @param songId - ID de la canción.
 */
export async function getSongStats(songId: string): Promise<SongStats> {
  const { data, error } = await supabase.rpc('get_song_stats', {
    p_song_id: songId
  })

  if (error != null) throw error

  const [row] = data
  return {
    likes: row?.like_count ?? 0,
    favorites: row?.favorite_count ?? 0,
    comments: row?.comment_count ?? 0,
    visits: row?.visit_count ?? 0
  }
}

/**
 * Canciones publicadas más populares según un contador.
 *
 * La view usa `security_invoker`: para quien no es admin, `visit_count` sale
 * en 0 y `favorite_count` solo cuenta sus favoritos. Ordena por likes o
 * comentarios en la parte pública.
 * @param field - Contador por el que ordenar (visitas por defecto).
 * @param limit - Número máximo de canciones.
 */
export async function getPopularSongs(
  field: SongPopularityField = 'visit_count',
  limit = 10
): Promise<DbSongWithCounts[]> {
  const { data, error } = await supabase
    .from('songs_with_counts')
    .select('*')
    .eq('isPublished', true)
    .order(field, { ascending: false, nullsFirst: false })
    .limit(limit)

  if (error != null) throw error

  return data
}

/**
 * Canciones publicadas más recientes, con sus artistas.
 * @param limit - Número máximo de canciones.
 */
export async function getRecentSongs(limit = 10): Promise<SongWithArtist[]> {
  const { data, error } = await supabase
    .from('songs')
    .select(SONG_WITH_ARTISTS_SELECT)
    .eq('isPublished', true)
    .order('createdAt', { ascending: false })
    .limit(limit)
    .returns<SongWithArtistsRow[]>()

  if (error != null) throw error

  return data.map(toSongWithArtist)
}

/**
 * Canciones publicadas con los IDs indicados, con sus artistas (p. ej. los
 * favoritos de un usuario).
 * @param ids - IDs de las canciones.
 */
export async function getSongsByIds(ids: string[]): Promise<SongWithArtist[]> {
  if (ids.length === 0) return []

  const { data, error } = await supabase
    .from('songs')
    .select(SONG_WITH_ARTISTS_SELECT)
    .in('id', ids)
    .eq('isPublished', true)
    .order('title', { ascending: true })
    .returns<SongWithArtistsRow[]>()

  if (error != null) throw error

  return data.map(toSongWithArtist)
}

/**
 * Publica u oculta una canción (admin).
 * @param id - ID de la canción.
 * @param isPublished - Nuevo estado.
 */
export async function setSongPublished(
  id: string,
  isPublished: boolean
): Promise<void> {
  const { error } = await supabase
    .from('songs')
    .update({ isPublished, updatedAt: new Date().toISOString() })
    .eq('id', id)

  if (error != null) throw error
}

// ─────────────────────────────────────────────
// ARTISTAS DE UNA CANCIÓN (tabla songs_artists)
// ─────────────────────────────────────────────

/**
 * Reemplaza los artistas asociados a una canción.
 * @param songId - ID de la canción.
 * @param artistIds - IDs de los artistas (en orden).
 */
export async function setSongArtists(
  songId: string,
  artistIds: string[]
): Promise<void> {
  const { error: deleteError } = await supabase
    .from('songs_artists')
    .delete()
    .eq('song_id', songId)

  if (deleteError != null) throw deleteError
  if (artistIds.length === 0) return

  const { error } = await supabase.from('songs_artists').insert(
    [...new Set(artistIds)].map((artistId) => ({
      song_id: songId,
      artist_id: artistId
    }))
  )

  if (error != null) throw error
}
