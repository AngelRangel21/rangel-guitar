/**
 * Tipos de dominio de la aplicación.
 * Derivados del schema de Supabase — usar estos en componentes y hooks,
 * NO usar los tipos de database.types.ts directamente en la UI.
 */

import type { Tables } from './database.types'

// ─────────────────────────────────────────────
// USUARIO
// ─────────────────────────────────────────────

/** Fila completa de un usuario tal como viene de Supabase */
export type DbUser = Tables<'users'>

/** Perfil de usuario para uso en la app (sin nulls innecesarios) */
export interface UserProfile {
  uid: string
  email: string
  name: string | null
  avatar_url: string | null
  isAdmin: boolean
  createdAt: string | null
}

// ─────────────────────────────────────────────
// CANCIÓN
// ─────────────────────────────────────────────
export type Song = Tables<'songs_2'>

/** Canción enriquecida con conteos (view songs_with_counts) */
export type DbSongWithCounts = Tables<'songs_with_counts'>

// ARTISTA
export type Artist = Tables<'artists'>

// ARTISTA CON CONTADOR DE CANCIONES
export type ArtistCount = Artist & {
  count: number
}

// ARTISTA + CANCIÓN
export type SongWithArtist = Song & {
  artist: Artist
}

/**
 * Helpers para convertir desde la view de Supabase al tipo Song de la app.
 * Centraliza la lógica de null-coalescing en un solo lugar.
 */
type SongNoKey = Omit<Song, 'key'>

export function mapDbSongWithCounts (row: DbSongWithCounts): SongNoKey {
  return {
    id: row.id ?? '',
    slug: row.slug ?? '',
    title: row.title ?? '',
    artist_id: row.artist_id ?? '',
    coverArt: row.coverArt ?? null,
    lyrics: row.lyrics ?? null,
    chords: row.chords ?? null,
    video: row.video ?? null,
    isPublished: row.isPublished ?? true,
    createdAt: row.createdAt ?? null,
    updatedAt: row.updatedAt ?? null
  }
}

// ─────────────────────────────────────────────
// SOLICITUDES DE CANCIONES
// ─────────────────────────────────────────────

/** Estado posible de una solicitud */
export type SongRequestStatus = 'pending' | 'approved' | 'rejected'

/** Fila completa de songs_requests */
export type DbSongRequest = Tables<'songs_requests'>

/** Solicitud de canción para uso en la app */
export interface SongRequest {
  id: string
  title: string
  artist: string
  requestedAt: string
  status: SongRequestStatus
  adminNote: string | null
  user_id: string
}

/** Para crear una nueva solicitud (el user_id lo pone el hook, no el form) */
export type NewSongRequest = Pick<SongRequest, 'title' | 'artist'>

// ─────────────────────────────────────────────
// LIKES, FAVORITOS, VISITAS
// ─────────────────────────────────────────────

export type DbSongLike = Tables<'song_likes'>
export type DbSongFavorite = Tables<'song_favorites'>
export type DbSongVisit = Tables<'song_visits'>

/** Resultado de toggle_song_like / toggle_song_favorite */
export interface ToggleLikeResult {
  liked: boolean
}

export interface ToggleFavoriteResult {
  favorited: boolean
}

// ─────────────────────────────────────────────
// COMENTARIOS
// ─────────────────────────────────────────────

export type DbSongComment = Tables<'song_comments'>

/** Comentario enriquecido con datos del usuario (para mostrar en UI) */
export interface SongComment {
  id: string
  song_id: string
  user_id: string
  content: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  // Join con users (cuando se hace select con embed)
  user?: Pick<UserProfile, 'uid' | 'name' | 'avatar_url'>
}

/** Para crear un comentario nuevo */
export type NewSongComment = Pick<SongComment, 'song_id' | 'content'>

// ─────────────────────────────────────────────
// BÚSQUEDA
// ─────────────────────────────────────────────

export interface SearchResult {
  songs: Song[]
  total: number
}

export interface SearchState {
  query: string
  results: Song[]
  isLoading: boolean
  error: string | null
  hasSearched: boolean
}
