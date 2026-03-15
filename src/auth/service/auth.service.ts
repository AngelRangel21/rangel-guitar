import { supabase } from '@/lib/supabase'
import type { AuthCredentials, UserProfile } from '@/types'
import type { Provider, Session, User, WeakPassword } from '@supabase/supabase-js'

const ADMIN_EMAILS = ['angel145256@gmail.com']

export class AuthService {
  // ─────────────────────────────────────────────
  // AUTH
  // ─────────────────────────────────────────────

  static async signInWithGoogle(): Promise<{ provider: Provider; url: string }> {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error != null) throw error
    return data
  }

  static async registerWithEmail({
    name,
    email,
    password,
  }: AuthCredentials): Promise<{ user: User | null; session: Session | null }> {
    if (name == null) throw new Error('Name is required for registration')
    if (email == null) throw new Error('Email is required for registration')
    if (password == null) throw new Error('Password is required for registration')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    if (error != null) throw error

    // Crear perfil en public.users inmediatamente
    if (data.user != null) {
      await AuthService.upsertUserProfile(data.user, name)
    }

    return data
  }

  static async signInWithEmail({
    email,
    password,
  }: AuthCredentials): Promise<{
    user: User
    session: Session
    weakPassword?: WeakPassword
  }> {
    if (email == null) throw new Error('Email is required for login')
    if (password == null) throw new Error('Password is required for login')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error != null) throw error

    // Asegurar que el perfil existe (por si fue creado antes de esta migración)
    await AuthService.upsertUserProfile(data.user)

    return data
  }

  static async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error != null) throw error
  }

  static async getSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession()
    if (error != null) throw error
    return data.session
  }

  // ─────────────────────────────────────────────
  // PERFIL
  // ─────────────────────────────────────────────

  /**
   * Upsert del perfil en public.users.
   * Se llama al registrar, al hacer login con email y tras OAuth callback.
   * Si el registro ya existe, solo actualiza avatar_url y name si cambiaron.
   */
  static async upsertUserProfile(supabaseUser: User, displayName?: string): Promise<void> {
    const name =
      displayName ??
      supabaseUser.user_metadata?.full_name ??
      supabaseUser.user_metadata?.name ??
      supabaseUser.email?.split('@')[0] ??
      'Anonymous'

    const avatar_url =
      supabaseUser.user_metadata?.avatar_url ??
      supabaseUser.user_metadata?.picture ??
      null

    const isAdmin = ADMIN_EMAILS.includes(supabaseUser.email ?? '')

    const { error } = await supabase.from('users').upsert(
      {
        uid: supabaseUser.id,
        email: supabaseUser.email ?? '',
        name,
        avatar_url,
        isAdmin,
      },
      {
        onConflict: 'uid',
        ignoreDuplicates: false, // sí actualizar si ya existe
      }
    )

    if (error != null) throw error
  }

  /**
   * Obtener el perfil completo del usuario desde public.users.
   * Retorna el perfil mapeado al tipo UserProfile de la app.
   */
  static async getUserProfile(uid: string): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('users')
      .select('uid, email, name, isAdmin, avatar_url, createdAt')
      .eq('uid', uid)
      .single()

    if (error != null) {
      // PGRST116 = fila no encontrada — no debería ocurrir si upsertUserProfile funcionó
      throw error
    }

    return {
      uid: data.uid,
      email: data.email,
      name: data.name,
      avatar_url: data.avatar_url,
      isAdmin: data.isAdmin ?? ADMIN_EMAILS.includes(data.email),
      createdAt: data.createdAt,
    }
  }
}
