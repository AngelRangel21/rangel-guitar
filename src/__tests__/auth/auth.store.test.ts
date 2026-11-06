import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  authService: {
    signInWithGoogle: vi.fn(),
    registerWithEmail: vi.fn(),
    signInWithEmail: vi.fn(),
    signOut: vi.fn()
  },
  userService: {
    getProfile: vi.fn()
  },
  favoriteService: {
    loadFavoriteIds: vi.fn(),
    toggleFavorite: vi.fn()
  },
  toast: {
    success: vi.fn(),
    error: vi.fn()
  },
  getUser: vi.fn()
}))

vi.mock('@/auth/service/auth.service', () => ({
  AuthService: mocks.authService
}))

vi.mock('@/auth/service/user.service', () => ({
  UserService: mocks.userService
}))

vi.mock('@/services/favorites.service', () => ({
  FavoriteService: mocks.favoriteService
}))

vi.mock('sonner', () => ({
  toast: mocks.toast
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: mocks.getUser
    }
  }
}))

import type { User } from '@supabase/supabase-js'
import { useAuthStore } from '@/auth/stores/auth.stores'

const supabaseUser = {
  id: 'user-1',
  email: 'ada@example.com',
  user_metadata: { full_name: 'Ada Lovelace' }
} as unknown as User

const profile = {
  uid: 'user-1',
  email: 'ada@example.com',
  name: 'Ada Lovelace',
  avatar_url: null,
  role: 'user' as const,
  createdAt: null
}

const resetStore = () => {
  useAuthStore.setState({
    supabaseUser: null,
    user: null,
    favoriteIds: new Set(),
    isLoading: true,
    isInitialized: false
  })
}

describe('useAuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetStore()
  })

  describe('signInWithEmail', () => {
    it('inicia sesión, saluda al usuario y apaga el loading', async () => {
      mocks.authService.signInWithEmail.mockResolvedValue({
        user: supabaseUser,
        session: {}
      })
      mocks.getUser.mockResolvedValue({
        data: { user: supabaseUser },
        error: null
      })

      await useAuthStore.getState().signInWithEmail({
        email: 'ada@example.com',
        password: 'secret123'
      })

      expect(mocks.authService.signInWithEmail).toHaveBeenCalledWith({
        email: 'ada@example.com',
        password: 'secret123'
      })
      expect(mocks.toast.success).toHaveBeenCalledWith(
        '¡Hola, Ada Lovelace! Bienvenido de nuevo.'
      )
      expect(useAuthStore.getState().isLoading).toBe(false)
    })

    it('activa el loading mientras espera la respuesta', async () => {
      let resolveSignIn: (value: unknown) => void = () => {}
      mocks.authService.signInWithEmail.mockReturnValue(
        new Promise((resolve) => {
          resolveSignIn = resolve
        })
      )
      mocks.getUser.mockResolvedValue({
        data: { user: supabaseUser },
        error: null
      })

      const promise = useAuthStore.getState().signInWithEmail({
        email: 'ada@example.com',
        password: 'secret123'
      })

      expect(useAuthStore.getState().isLoading).toBe(true)
      resolveSignIn({ user: supabaseUser, session: {} })
      await promise
      expect(useAuthStore.getState().isLoading).toBe(false)
    })

    it('muestra un toast y propaga el error', async () => {
      const error = new Error('Invalid credentials')
      mocks.authService.signInWithEmail.mockRejectedValue(error)

      await expect(
        useAuthStore.getState().signInWithEmail({
          email: 'ada@example.com',
          password: 'wrong'
        })
      ).rejects.toBe(error)

      expect(mocks.toast.error).toHaveBeenCalledWith(
        'Email o contraseña incorrectos'
      )
      expect(useAuthStore.getState().isLoading).toBe(false)
    })
  })

  describe('registerWithEmail', () => {
    it('registra al usuario y muestra un toast de éxito', async () => {
      mocks.authService.registerWithEmail.mockResolvedValue({
        user: supabaseUser,
        session: {}
      })

      await useAuthStore.getState().registerWithEmail({
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        password: 'secret123'
      })

      expect(mocks.authService.registerWithEmail).toHaveBeenCalledWith({
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        password: 'secret123'
      })
      expect(mocks.toast.success).toHaveBeenCalledWith(
        '¡Cuenta creada! Revisa tu correo para confirmar.'
      )
      expect(useAuthStore.getState().isLoading).toBe(false)
    })

    it('devuelve false cuando Supabase pide confirmar el correo', async () => {
      mocks.authService.registerWithEmail.mockResolvedValue({
        user: supabaseUser,
        session: null
      })

      const hasSession = await useAuthStore.getState().registerWithEmail({
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        password: 'secret123'
      })

      expect(hasSession).toBe(false)
    })

    it('muestra un toast y propaga el error', async () => {
      const error = new Error('User already registered')
      mocks.authService.registerWithEmail.mockRejectedValue(error)

      await expect(
        useAuthStore.getState().registerWithEmail({
          name: 'Ada Lovelace',
          email: 'ada@example.com',
          password: 'secret123'
        })
      ).rejects.toBe(error)

      expect(mocks.toast.error).toHaveBeenCalledWith('Error al crear la cuenta')
      expect(useAuthStore.getState().isLoading).toBe(false)
    })
  })

  describe('signInWithGoogle', () => {
    it('delega en AuthService', async () => {
      mocks.authService.signInWithGoogle.mockResolvedValue({})

      await useAuthStore.getState().signInWithGoogle()

      expect(mocks.authService.signInWithGoogle).toHaveBeenCalledOnce()
      expect(useAuthStore.getState().isLoading).toBe(false)
    })

    it('muestra un toast y propaga el error', async () => {
      const error = new Error('OAuth unavailable')
      mocks.authService.signInWithGoogle.mockRejectedValue(error)

      await expect(useAuthStore.getState().signInWithGoogle()).rejects.toBe(
        error
      )

      expect(mocks.toast.error).toHaveBeenCalledWith(
        'Error al iniciar sesión con Google'
      )
    })
  })

  describe('logout', () => {
    it('cierra la sesión y limpia el estado', async () => {
      useAuthStore.setState({
        supabaseUser,
        user: profile,
        favoriteIds: new Set(['song-1'])
      })
      mocks.authService.signOut.mockResolvedValue(undefined)

      await useAuthStore.getState().logout()

      expect(useAuthStore.getState().supabaseUser).toBeNull()
      expect(useAuthStore.getState().user).toBeNull()
      expect(useAuthStore.getState().favoriteIds.size).toBe(0)
      expect(mocks.toast.success).toHaveBeenCalledWith('Sesión cerrada')
    })

    it('muestra un toast y propaga el error', async () => {
      const error = new Error('Sign out failed')
      mocks.authService.signOut.mockRejectedValue(error)

      await expect(useAuthStore.getState().logout()).rejects.toBe(error)

      expect(mocks.toast.error).toHaveBeenCalledWith('Error al cerrar sesión')
    })
  })

  describe('loadUserProfile', () => {
    it('carga el perfil y los favoritos', async () => {
      mocks.userService.getProfile.mockResolvedValue(profile)
      mocks.favoriteService.loadFavoriteIds.mockResolvedValue(
        new Set(['song-1'])
      )

      await useAuthStore.getState().loadUserProfile(supabaseUser)

      expect(useAuthStore.getState().supabaseUser).toBe(supabaseUser)
      expect(useAuthStore.getState().user).toEqual(profile)
      expect(useAuthStore.getState().favoriteIds).toEqual(new Set(['song-1']))
      expect(mocks.favoriteService.loadFavoriteIds).toHaveBeenCalledWith(
        'user-1'
      )
    })

    it('muestra un toast si no puede cargar el perfil', async () => {
      mocks.userService.getProfile.mockRejectedValue(new Error('DB error'))

      await useAuthStore.getState().loadUserProfile(supabaseUser)

      expect(mocks.toast.error).toHaveBeenCalledWith(
        'Error al cargar el perfil'
      )
    })
  })
})
