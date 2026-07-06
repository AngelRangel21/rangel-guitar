/** biome-ignore-all lint/complexity/noStaticOnlyClass: explain */
import { supabase } from '@/lib/supabase'
import type { AuthCredentials } from '@/types'

export class AuthService {
  static getRedirectUrl() {
    return typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback`
      : 'http://localhost:3000/auth/callback'
  }

  static async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: AuthService.getRedirectUrl()
      }
    })

    if (error != null) throw error
    return data
  }

  static async registerWithEmail({ name, email, password }: AuthCredentials) {
    if (!name) throw new Error('Name is required')
    if (!email) throw new Error('Email is required')
    if (!password) throw new Error('Password is required')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })

    if (error != null) throw error

    if (data.user != null) null

    return {
      user: data.user,
      session: data.session
    }
  }

  static async signInWithEmail({ email, password }: AuthCredentials) {
    if (!email) throw new Error('Email is required')
    if (!password) throw new Error('Password is required')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error != null) throw error

    return {
      user: data.user,
      session: data.session
    }
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error != null) throw error
  }

  static async getSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error != null) throw error
    return data.session
  }
}
