import type { User } from '@supabase/supabase-js'
import { toast } from 'sonner'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { FavoriteService } from '@/services/favorites.service'
import type { AuthCredentials, UserProfile } from '@/types'
import { AuthService } from '../service/auth.service'
import { UserService } from '../service/user.service'

interface AuthState {
  // ── Estado ──────────────────────────────────
  supabaseUser: User | null
  user: UserProfile | null
  /** Set de song_id para O(1) en isFavorite() */
  favoriteIds: Set<string>
  isLoading: boolean
  isInitialized: boolean
  isAdmin: boolean

  // ── Setters internos ─────────────────────────
  _setSupabaseUser: (user: User | null) => void
  _setUser: (user: UserProfile | null) => void
  _setFavoriteIds: (ids: Set<string>) => void
  _setLoading: (loading: boolean) => void
  _setInitialized: (initialized: boolean) => void

  // ── Acciones de autenticación ────────────────
  signInWithGoogle: () => Promise<void>
  registerWithEmail: (credentials: AuthCredentials) => Promise<void>
  signInWithEmail: (credentials: AuthCredentials) => Promise<void>
  logout: () => Promise<void>

  // ── Carga de datos ───────────────────────────
  loadUserProfile: (supabaseUser: User) => Promise<void>
  loadFavorites: () => Promise<void>

  // ── Favoritos ────────────────────────────────
  toggleFavorite: (songId: string) => Promise<void>
  isFavorite: (songId: string) => boolean
}

// ── Selectores derivados (fuera del store, sin re-renders extra) ──────────
export const selectIsAuthenticated = (s: AuthState): boolean => s.user != null
export const selectIsAdmin = (s: AuthState): boolean => s.user?.isAdmin ?? false
export const selectUser = (s: AuthState): UserProfile | null => s.user
export const selectFavoriteIds = (s: AuthState): Set<string> => s.favoriteIds

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      // ── Estado inicial ────────────────────────
      supabaseUser: null,
      user: null,
      favoriteIds: new Set(),
      isLoading: true,
      isInitialized: false,

      // ── Setters ───────────────────────────────
      _setSupabaseUser: (supabaseUser) =>
        set({ supabaseUser }, false, 'setSupabaseUser'),

      _setUser: (user) => set({ user }, false, 'setUser'),

      _setFavoriteIds: (favoriteIds) =>
        set({ favoriteIds }, false, 'setFavoriteIds'),

      _setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),

      _setInitialized: (isInitialized) =>
        set({ isInitialized }, false, 'setInitialized'),

      // ── Auth actions ──────────────────────────

      signInWithGoogle: async () => {
        try {
          set({ isLoading: true }, false, 'signInWithGoogle:start')
          await AuthService.signInWithGoogle()
          // El listener onAuthStateChange (en AuthProvider) maneja el resto
        } catch (error) {
          console.error('Google sign in error:', error)
          toast.error('Error al iniciar sesión con Google')
          throw error
        } finally {
          set({ isLoading: false }, false, 'signInWithGoogle:end')
        }
      },

      registerWithEmail: async (credentials) => {
        try {
          set({ isLoading: true }, false, 'registerWithEmail:start')
          await AuthService.registerWithEmail(credentials)
          toast.success('¡Cuenta creada! Revisa tu correo para confirmar.')
        } catch (error) {
          console.error('Registration error:', error)
          toast.error('Error al crear la cuenta')
          throw error
        } finally {
          set({ isLoading: false }, false, 'registerWithEmail:end')
        }
      },

      signInWithEmail: async (credentials) => {
        try {
          set({ isLoading: true }, false, 'signInWithEmail:start')
          await AuthService.signInWithEmail(credentials)
          toast.success('¡Bienvenido de nuevo!')
        } catch (error) {
          console.error('Sign in error:', error)
          toast.error('Email o contraseña incorrectos')
          throw error
        } finally {
          set({ isLoading: false }, false, 'signInWithEmail:end')
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true }, false, 'logout:start')
          await AuthService.signOut()
          set(
            { supabaseUser: null, user: null, favoriteIds: new Set() },
            false,
            'logout:complete'
          )
          toast.success('Sesión cerrada')
        } catch (error) {
          console.error('Logout error:', error)
          toast.error('Error al cerrar sesión')
          throw error
        } finally {
          set({ isLoading: false }, false, 'logout:end')
        }
      },

      // ── Carga de datos ────────────────────────

      /**
       * Carga el perfil desde public.users y luego los favoritos.
       * Llamado por AuthProvider en cada cambio de sesión.
       */
      loadUserProfile: async (supabaseUser: User) => {
        try {
          set({ supabaseUser }, false, 'loadUserProfile:setSupabaseUser')

          // Upsert primero (garantiza que el row existe)
          await UserService.syncUser(supabaseUser)

          // Luego leer el perfil completo
          const profile = await UserService.getProfile(supabaseUser.id)
          set({ user: profile }, false, 'loadUserProfile:success')

          // Cargar favoritos
          await get().loadFavorites()
        } catch (error) {
          console.error('Error loading user profile:', error)
          toast.error('Error al cargar el perfil')
        }
      },

      loadFavorites: async () => {
        const { user } = get()
        if (user == null) return

        try {
          const ids = await FavoriteService.loadFavoriteIds(user.uid)
          set({ favoriteIds: ids }, false, 'loadFavorites:success')
        } catch (error) {
          console.error('Error loading favorites:', error)
          toast.error('Error al cargar tus favoritos')
        }
      },

      // ── Favoritos ─────────────────────────────

      toggleFavorite: async (songId) => {
        const { user, favoriteIds } = get()

        if (user == null) {
          toast.error('Inicia sesión para guardar favoritos')
          return
        }

        // Optimistic update — actualizar UI antes de la respuesta
        const newIds = new Set(favoriteIds)
        const wasAlreadyFav = newIds.has(songId)
        wasAlreadyFav ? newIds.delete(songId) : newIds.add(songId)
        set({ favoriteIds: newIds }, false, 'toggleFavorite:optimistic')

        try {
          await FavoriteService.toggleFavorite(songId, user.uid)
        } catch (error) {
          // Revertir si falla
          const revertedIds = new Set(favoriteIds)
          set({ favoriteIds: revertedIds }, false, 'toggleFavorite:revert')
          console.error('Toggle favorite error:', error)
          toast.error('No se pudo actualizar favoritos')
        }
      },

      isFavorite: (songId) => {
        return get().favoriteIds.has(songId)
      }
    }),
    { name: 'AuthStore' }
  )
)
