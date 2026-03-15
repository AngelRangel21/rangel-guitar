'use client'

import { useAuthStore, selectIsAuthenticated, selectIsAdmin } from '@/auth/stores/auth.stores'
import { AuthCredentials, UserProfile } from '@/types'
import { useShallow } from 'zustand/react/shallow'

/**
 * Hook para usar autenticación en componentes
 * Wrapper sobre el store de Zustand con selección optimizada
 */
export function useAuth (): {
  isAuthenticated: boolean
  user: UserProfile | null
  isAdmin: boolean
  isLoaded: boolean
  isLoading: boolean
  isInitializing: boolean
  signInWithGoogle: () => Promise<void>
  registerWithEmail: (credentials: AuthCredentials) => Promise<void>
  signInWithEmail: (credentials: AuthCredentials) => Promise<void>
  logout: () => Promise<void>
  toggleFavorite: (songId: string, songSlug: string) => Promise<void>
  isFavorite: (songId: string) => boolean } {
  // Seleccionar solo lo que necesitas para evitar re-renders innecesarios
  return useAuthStore(
    useShallow((state) => ({
      // Estado
      isAuthenticated: selectIsAuthenticated(state),
      user: state.user,
      isAdmin: selectIsAdmin(state),
      isLoaded: state.isInitialized && !state.isLoading,
      isLoading: state.isLoading,
      isInitializing: state.isInitialized,

      // Métodos de auth
      signInWithGoogle: state.signInWithGoogle,
      registerWithEmail: state.registerWithEmail,
      signInWithEmail: state.signInWithEmail,
      logout: state.logout,

      // Métodos de favoritos
      toggleFavorite: state.toggleFavorite,
      isFavorite: state.isFavorite
    }))
  )
}

/**
 * Hook optimizado para componentes que solo necesitan el estado de autenticación
 */
export function useAuthStatus (): {
  isAuthenticated: boolean
  isLoading: boolean
  isLoaded: boolean
  isAdmin: boolean
  isInitializing: boolean
} {
  return useAuthStore(
    useShallow((state) => ({
      isAuthenticated: selectIsAuthenticated(state),
      isLoading: state.isLoading,
      isLoaded: state.isInitialized,
      isAdmin: state.isAdmin,
      isInitializing: state.isInitialized
    }))
  )
}

/**
 * Hook optimizado para componentes que solo necesitan datos del usuario
 */
export function useUser (): {
  user: UserProfile | null
  isAdmin: boolean
} {
  return useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isAdmin: state.isAdmin
    }))
  )
}
