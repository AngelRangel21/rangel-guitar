/**
 * Tipos de autenticación — Supabase Auth.
 *
 * Supabase Auth devuelve un `session.user.id` (UUID) que corresponde
 * al `uid` de nuestra tabla `public.users`.
 */

import type { Song, SongRequest, UserProfile } from './app.types'

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

export interface AuthCredentials {
  email: string
  password: string
  name?: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: UserProfile | null
  isAdmin: boolean
  isLoading: boolean
  isLoaded: boolean
}

// ─────────────────────────────────────────────
// FAVORITOS
// ─────────────────────────────────────────────

/**
 * favoriteIds: set de song_id que el usuario tiene guardados.
 * Se usa para saber instantáneamente si una canción está en favoritos
 * sin ir a la DB en cada render.
 */
export interface FavoritesState {
  favoriteIds: Set<string>
  toggleFavorite: (songId: string) => Promise<void>
  isFavorite: (songId: string) => boolean
}

// ─────────────────────────────────────────────
// HOOKS — return types
// ─────────────────────────────────────────────

export interface UseAuthReturn extends AuthState, FavoritesState {
  signInWithGoogle: () => Promise<void>
  registerWithEmail: (credentials: AuthCredentials) => Promise<void>
  signInWithEmail: (credentials: AuthCredentials) => Promise<void>
  logout: () => Promise<void>
}

export interface UseAuthStatusReturn {
  isAuthenticated: boolean
  isLoading: boolean
  isLoaded: boolean
}

export interface UseUserReturn {
  user: UserProfile | null
  isAdmin: boolean
}

export interface UseFavoritesReturn extends FavoritesState {
  favoriteSongs: Song[]
  isLoadingFavorites: boolean
}

export interface UseSongRequestsReturn {
  requests: SongRequest[]
  isLoading: boolean
  error: string | null
  submitRequest: (title: string, artist: string) => Promise<void>
}
