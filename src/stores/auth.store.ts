import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User } from '@supabase/supabase-js'
import { AuthService } from '@/services/auth.service'
import { FavoritesService } from '@/services/favorites.service'
import { toast } from 'sonner'
import { AuthCredentials, UserProfile } from '@/types/auth.types'

interface AuthState {
  // Estado
  supabaseUser: User | null
  user: UserProfile | null
  favorites: string[]
  isLoading: boolean
  isInitialized: boolean
  isAdmin: boolean

  // Acciones internas
  setSupabaseUser: (user: User | null) => void
  setUser: (user: UserProfile | null) => void
  setFavorites: (favorites: string[]) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void

  // Acciones de autenticación
  signInWithGoogle: () => Promise<void>
  registerWithEmail: (credentials: AuthCredentials) => Promise<void>
  signInWithEmail: (credentials: AuthCredentials) => Promise<void>
  logout: () => Promise<void>
  loadUserProfile: () => Promise<void>

  // Acciones de favoritos
  toggleFavorite: (songId: string, songSlug: string) => Promise<void>
  isFavorite: (songId: string) => boolean
  loadFavorites: () => void
}

// Selectores computed (fuera del store)
export const selectIsAuthenticated = (state: AuthState) => !(state.user == null)
export const selectIsAdmin = (state: AuthState) => state.user?.isAdmin ?? false

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // ==================== ESTADO INICIAL ====================
        supabaseUser: null,
        user: null,
        favorites: [],
        isLoading: true,
        isInitialized: false,
        isAuthenticated: false,
        isAdmin: false,

        // ==================== SETTERS ====================
        setSupabaseUser: (supabaseUser) => {
          set({ supabaseUser }, false, 'setSupabaseUser')

          // Si el usuario cambió, cargar su perfil
          if (supabaseUser != null) {
            get().loadUserProfile()
          } else {
            set({ user: null, favorites: [] }, false, 'clearUserOnLogout')
          }
        },

        setUser: (user) => set({ user }, false, 'setUser'),
        setFavorites: (favorites) => set({ favorites }, false, 'setFavorites'),
        setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),
        setInitialized: (isInitialized) => set({ isInitialized }, false, 'setInitialized'),

        // ==================== ACCIONES DE AUTENTICACIÓN ====================
        signInWithGoogle: async () => {
          try {
            set({ isLoading: true }, false, 'signInWithGoogle:start')
            await AuthService.signInWithGoogle()
            // El listener de auth state se encargará del resto
          } catch (error) {
            console.error('Google sign in error:', error)
            toast.error('Error signing in with Google')
            throw error
          } finally {
            set({ isLoading: false }, false, 'signInWithGoogle:end')
          }
        },

        registerWithEmail: async (credentials) => {
          try {
            set({ isLoading: true }, false, 'registerWithEmail:start')
            await AuthService.registerWithEmail(credentials)
            toast.success('Account created successfully!')
          } catch (error) {
            console.error('Registration error:', error)
            toast.error('Error creating account')
            throw error
          } finally {
            set({ isLoading: false }, false, 'registerWithEmail:end')
          }
        },

        signInWithEmail: async (credentials) => {
          try {
            set({ isLoading: true }, false, 'signInWithEmail:start')
            await AuthService.signInWithEmail(credentials)
            toast.success('Logged in successfully!')
          } catch (error) {
            console.error('Sign in error:', error)
            toast.error('Error signing in')
            throw error
          } finally {
            set({ isLoading: false }, false, 'signInWithEmail:end')
          }
        },

        logout: async () => {
          try {
            set({ isLoading: true }, false, 'logout:start')

            const { user } = get()
            if (user != null) {
              FavoritesService.clearFavorites(user.uid)
            }

            await AuthService.signOut()

            set({
              supabaseUser: null,
              user: null,
              favorites: []
            }, false, 'logout:complete')
          } catch (error) {
            console.error('Logout error:', error)
            toast.error('Error signing out')
            throw error
          } finally {
            set({ isLoading: false }, false, 'logout:end')
          }
        },

        loadUserProfile: async () => {
          const { supabaseUser } = get()

          if (supabaseUser == null) {
            set({ user: null, favorites: [] }, false, 'loadUserProfile:noUser')
            return
          }

          try {
            // Cargar perfil
            const profile = await AuthService.getUserProfile(
              supabaseUser.id,
              supabaseUser.email ?? undefined
            )

            set({ user: profile }, false, 'loadUserProfile:success')

            // Cargar favoritos
            get().loadFavorites()
          } catch (error) {
            console.error('Error loading user profile:', error)
            toast.error('Error loading profile')
          }
        },

        // ==================== ACCIONES DE FAVORITOS ====================

        loadFavorites: () => {
          const { user } = get()

          if (user == null) {
            set({ favorites: [] }, false, 'loadFavorites:noUser')
            return
          }

          const favorites = FavoritesService.getFavorites(user.uid)
          set({ favorites }, false, 'loadFavorites:success')
        },

        toggleFavorite: async (songId, songSlug) => {
          const { user, favorites } = get()

          if (user == null) {
            toast.error('Please log in to add favorites')
            return
          }

          try {
            const { newFavorites } = await FavoritesService.toggleFavorite(
              user.uid,
              songId,
              songSlug,
              favorites
            )

            set({ favorites: newFavorites }, false, 'toggleFavorite:success')
          } catch (error) {
            console.error('Toggle favorite error:', error)
            toast.error('Could not update favorites')
          }
        },

        isFavorite: (songId) => {
          const { favorites } = get()
          return FavoritesService.isFavorite(songId, favorites)
        }
      }),
      {
        name: 'auth-storage',
        // Solo persistir favoritos, no el usuario completo
        partialize: (state) => ({
          favorites: state.favorites
        })
      }
    )
  )
)
