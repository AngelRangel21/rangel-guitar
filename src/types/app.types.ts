/**
 * Tipos de dominio de la aplicación.
 * Derivados del schema de Supabase — usar estos en componentes y hooks,
 * NO usar los tipos de database.types.ts directamente en la UI.
 */

import type { Tables } from "./database.types"

// ─────────────────────────────────────────────
// USUARIO
// ─────────────────────────────────────────────

/** Fila completa de un usuario tal como viene de Supabase */
export type DbUser = Tables<"users">

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

/** Fila base de una canción (tabla songs) */
export type DbSong = Tables<"songs">

/** Canción enriquecida con conteos (view songs_with_counts) */
export type DbSongWithCounts = Tables<"songs_with_counts">

/**
 * Tipo principal de Canción para uso en la app.
 * Viene de la view songs_with_counts — nunca del raw songs.
 * Los conteos son siempre number (0 si null desde la DB).
 */
export interface Song {
  id: string
  slug: string
  title: string
  artist: string
  coverArt: string | null
  lyrics: string | null
  chords: string | null
  video: string | null
  isPublished: boolean
  createdAt: string | null
  updatedAt: string | null
  // Conteos relacionales (de la view)
  likeCount: number
  visitCount: number
  favoriteCount: number
  commentCount: number
}

/**
 * Helpers para convertir desde la view de Supabase al tipo Song de la app.
 * Centraliza la lógica de null-coalescing en un solo lugar.
 */
export function mapDbSongWithCounts(row: DbSongWithCounts): Song {
  return {
    id: row.id ?? "",
    slug: row.slug ?? "",
    title: row.title ?? "",
    artist: row.artist ?? "",
    coverArt: row.coverArt ?? null,
    lyrics: row.lyrics ?? null,
    chords: row.chords ?? null,
    video: row.video ?? null,
    isPublished: row.isPublished ?? true,
    createdAt: row.createdAt ?? null,
    updatedAt: row.updatedAt ?? null,
    likeCount: row.like_count ?? 0,
    visitCount: row.visit_count ?? 0,
    favoriteCount: row.favorite_count ?? 0,
    commentCount: row.comment_count ?? 0,
  }
}

// ─────────────────────────────────────────────
// SOLICITUDES DE CANCIONES
// ─────────────────────────────────────────────

/** Estado posible de una solicitud */
export type SongRequestStatus = "pending" | "approved" | "rejected"

/** Fila completa de songs_requests */
export type DbSongRequest = Tables<"songs_requests">

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
export type NewSongRequest = Pick<SongRequest, "title" | "artist">

// ─────────────────────────────────────────────
// LIKES, FAVORITOS, VISITAS
// ─────────────────────────────────────────────

export type DbSongLike = Tables<"song_likes">
export type DbSongFavorite = Tables<"song_favorites">
export type DbSongVisit = Tables<"song_visits">

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

export type DbSongComment = Tables<"song_comments">

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
  user?: Pick<UserProfile, "uid" | "name" | "avatar_url">
}

/** Para crear un comentario nuevo */
export type NewSongComment = Pick<SongComment, "song_id" | "content">

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
