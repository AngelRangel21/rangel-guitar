'use client'

import { useShallow } from 'zustand/react/shallow'
import {
  selectIsAdmin,
  selectIsAuthenticated,
  useAuthStore
} from '@/auth/stores/auth.stores'

/**
 * Hook para usar autenticación en componentes
 * Wrapper sobre el store de Zustand con selección optimizada
 */
export function useAuth() {
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
export function useAuthStatus() {
  return useAuthStore(
    useShallow((state) => ({
      isAuthenticated: selectIsAuthenticated(state),
      isLoading: state.isLoading,
      isLoaded: state.isInitialized,
      isAdmin: selectIsAdmin(state),
      isInitializing: state.isInitialized
    }))
  )
}

/**
 * Hook optimizado para componentes que solo necesitan datos del usuario
 */
export function useUser() {
  return useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isAdmin: selectIsAdmin(state)
    }))
  )
}
