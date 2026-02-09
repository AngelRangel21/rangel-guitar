/**
 * Tipos compartidos para autenticación
 */

export interface User {
  uid: string
  name: string
  email?: string
}

export interface UserProfile extends User {
  isAdmin: boolean
}

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

export interface FavoritesState {
  favorites: string[]
  toggleFavorite: (songId: string, songSlug: string) => Promise<void>
  isFavorite: (songId: string) => boolean
}

// Tipos para los hooks
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

export interface UseFavoritesReturn extends FavoritesState {}
