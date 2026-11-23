import { supabase } from '@/lib/supabase'
import type { DbUser, Roles } from '@/types/app.types'
import type { Tables } from '@/types/database.types'

type Role = Tables<'roles'>

/** Campos que el propio usuario puede editar de su perfil. */
export type UserProfileUpdate = Partial<Pick<DbUser, 'name' | 'avatar_url'>>

export function getUserImage(user: string) {
  const { data } = supabase.storage.from('users-images').getPublicUrl(user)
  return data.publicUrl
}

/**
 * Obtiene un usuario por su UID, o `null` si no existe.
 * @param uid - UID del usuario.
 */
export async function getUserById(uid: string): Promise<DbUser | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('uid', uid)
    .maybeSingle()

  if (error != null) throw error

  return data as DbUser | null
}

/** Lista todos los usuarios, del más reciente al más antiguo (admin). */
export async function getUsers(): Promise<DbUser[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('createdAt', { ascending: false })

  if (error != null) throw error

  return data as DbUser[]
}

/**
 * Actualiza el nombre o el avatar de un usuario.
 * @param uid - UID del usuario.
 * @param profile - Campos a cambiar.
 */
export async function updateUserProfile(
  uid: string,
  profile: UserProfileUpdate
): Promise<DbUser> {
  const { data, error } = await supabase
    .from('users')
    .update(profile)
    .eq('uid', uid)
    .select()
    .single()

  if (error != null) throw error

  return data as DbUser
}

/**
 * Cambia el rol de un usuario (admin).
 * @param uid - UID del usuario.
 * @param role - Nuevo rol.
 */
export async function updateUserRole(uid: string, role: Roles): Promise<void> {
  const { error } = await supabase.from('users').update({ role }).eq('uid', uid)

  if (error != null) throw error
}

/** Roles disponibles en la tabla `roles`. */
export async function getRoles(): Promise<Role[]> {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('name', { ascending: true })

  if (error != null) throw error

  return data
}

/** Indica si el usuario con sesión actual es administrador (RPC `is_admin`). */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_admin')

  if (error != null) throw error

  return data === true
}
