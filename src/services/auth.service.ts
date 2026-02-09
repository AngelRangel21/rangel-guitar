import { supabase } from '@/lib/supabase'
import { AuthCredentials, UserProfile } from '@/types/auth.types'
import { Provider, Session, User, WeakPassword } from '@supabase/supabase-js'

const ADMIN_EMAILS = ['angel145256@gmail.com']

export class AuthService {
  static async signInWithGoogle (): Promise<{
    provider: Provider
    url: string
  }> {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
    if (error != null) throw error
    return data
  }

  static async registerWithEmail ({ name, email, password }: AuthCredentials): Promise<{
    user: User | null
    session: Session | null
  }> {
    if (name == null) {
      throw new Error('Name is required for registration')
    }

    if (email == null) {
      throw new Error('Email is required for registration')
    }

    if (password == null) {
      throw new Error('Password is required for registration')
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })
    if (error != null) throw error
    return data
  }

  static async signInWithEmail ({ email, password }: AuthCredentials): Promise<{
    user: User
    session: Session
    weakPassword?: WeakPassword
  }> {
    if (email == null) {
      throw new Error('Email is required for login')
    }

    if (password == null) {
      throw new Error('Password is required for login')
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error != null) throw error
    return data
  }

  static async signOut (): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error != null) throw error
  }

  /**
   * Obtener perfil del usuario actual desde la table users
   */
  static async getUserProfile (uid: string, email?: string): Promise<UserProfile> {
    const { data: userDoc, error } = await supabase
      .from('users')
      .select('name, isAdmin')
      .eq('uid', uid)
      .single()
    if ((error != null) && error.code !== 'PGRST116') {
      // PGRST116: No se encontró el registro
      throw error
    }

    const name = userDoc?.name || email?.split('@')[0] || 'Anonymous'
    const isAdmin = userDoc?.isAdmin || ADMIN_EMAILS.includes(email ?? '')

    return {
      uid,
      name,
      isAdmin
    }
  }

  /**
   * Obtener la sesión actual
   */
  static async getSession (): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession()
    if (error != null) throw error
    return data.session
  }
}
