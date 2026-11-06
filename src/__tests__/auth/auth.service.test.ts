import { beforeEach, describe, expect, it, vi } from 'vitest'

const authMocks = vi.hoisted(() => ({
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  signInWithOAuth: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn()
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: authMocks
  }
}))

import { AuthService } from '@/auth/service/auth.service'

const user = { id: 'user-1', email: 'user@example.com' }
const session = { access_token: 'token', user }

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getRedirectUrl', () => {
    it('usa el origen actual del navegador', () => {
      expect(AuthService.getRedirectUrl()).toBe(
        'http://localhost:3000/auth/callback'
      )
    })
  })

  describe('signInWithEmail', () => {
    it('inicia sesión con email y contraseña', async () => {
      authMocks.signInWithPassword.mockResolvedValue({
        data: { user, session },
        error: null
      })

      const result = await AuthService.signInWithEmail({
        email: 'user@example.com',
        password: 'secret123'
      })

      expect(authMocks.signInWithPassword).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'secret123'
      })
      expect(result).toEqual({ user, session })
    })

    it('exige el email', async () => {
      await expect(
        AuthService.signInWithEmail({ email: '', password: 'secret123' })
      ).rejects.toThrow('Email is required')
    })

    it('exige la contraseña', async () => {
      await expect(
        AuthService.signInWithEmail({
          email: 'user@example.com',
          password: ''
        })
      ).rejects.toThrow('Password is required')
    })

    it('propaga el error de Supabase', async () => {
      const error = { message: 'Invalid credentials', status: 400 }
      authMocks.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error
      })

      await expect(
        AuthService.signInWithEmail({
          email: 'user@example.com',
          password: 'wrong'
        })
      ).rejects.toBe(error)
    })
  })

  describe('registerWithEmail', () => {
    it('registra al usuario con su nombre en los metadatos', async () => {
      authMocks.signUp.mockResolvedValue({
        data: { user, session },
        error: null
      })

      const result = await AuthService.registerWithEmail({
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        password: 'secret123'
      })

      expect(authMocks.signUp).toHaveBeenCalledWith({
        email: 'ada@example.com',
        password: 'secret123',
        options: { data: { full_name: 'Ada Lovelace' } }
      })
      expect(result).toEqual({ user, session })
    })

    it('exige el nombre', async () => {
      await expect(
        AuthService.registerWithEmail({
          email: 'ada@example.com',
          password: 'secret123'
        })
      ).rejects.toThrow('Name is required')
    })

    it('exige el email', async () => {
      await expect(
        AuthService.registerWithEmail({
          name: 'Ada Lovelace',
          email: '',
          password: 'secret123'
        })
      ).rejects.toThrow('Email is required')
    })

    it('exige la contraseña', async () => {
      await expect(
        AuthService.registerWithEmail({
          name: 'Ada Lovelace',
          email: 'ada@example.com',
          password: ''
        })
      ).rejects.toThrow('Password is required')
    })

    it('propaga el error de Supabase', async () => {
      const error = { message: 'User already registered', status: 422 }
      authMocks.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error
      })

      await expect(
        AuthService.registerWithEmail({
          name: 'Ada Lovelace',
          email: 'ada@example.com',
          password: 'secret123'
        })
      ).rejects.toBe(error)
    })
  })

  describe('signInWithGoogle', () => {
    it('inicia el flujo OAuth con Google y la URL de callback', async () => {
      const data = { provider: 'google', url: 'https://accounts.google.com' }
      authMocks.signInWithOAuth.mockResolvedValue({ data, error: null })

      const result = await AuthService.signInWithGoogle()

      expect(authMocks.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback'
        }
      })
      expect(result).toEqual(data)
    })

    it('propaga el error de Supabase', async () => {
      const error = { message: 'OAuth unavailable' }
      authMocks.signInWithOAuth.mockResolvedValue({ data: null, error })

      await expect(AuthService.signInWithGoogle()).rejects.toBe(error)
    })
  })

  describe('signOut', () => {
    it('cierra la sesión', async () => {
      authMocks.signOut.mockResolvedValue({ error: null })

      await AuthService.signOut()

      expect(authMocks.signOut).toHaveBeenCalledOnce()
    })

    it('propaga el error de Supabase', async () => {
      const error = { message: 'Sign out failed' }
      authMocks.signOut.mockResolvedValue({ error })

      await expect(AuthService.signOut()).rejects.toBe(error)
    })
  })

  describe('getSession', () => {
    it('devuelve la sesión actual', async () => {
      authMocks.getSession.mockResolvedValue({
        data: { session },
        error: null
      })

      await expect(AuthService.getSession()).resolves.toBe(session)
    })

    it('propaga el error de Supabase', async () => {
      const error = { message: 'Session failed' }
      authMocks.getSession.mockResolvedValue({ data: { session: null }, error })

      await expect(AuthService.getSession()).rejects.toBe(error)
    })
  })
})
