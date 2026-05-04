/** biome-ignore-all lint/complexity/noStaticOnlyClass: explain */
/** biome-ignore-all lint/suspicious/noExplicitAny: explain */
import type { User } from '@supabase/supabase-js'
import { UserRepository } from './user.repository'

export const ADMIN_EMAILS = ['angel145256@gmail.com']

export class UserService {
  static buildProfile(
    user: User,
    displayName?: string
  ): {
    uid: string
    email: string
    name: any
    avatar_url: any
    isAdmin: boolean
  } {
    const name =
      displayName ??
      user.user_metadata?.full_name ??
      user.user_metadata?.name ??
      user.email?.split('@')[0] ??
      'Anonymous'

    const avatar_url =
      user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null

    const isAdmin = ADMIN_EMAILS.includes(user.email ?? '')

    return {
      uid: user.id,
      email: user.email ?? '',
      name,
      avatar_url,
      isAdmin
    }
  }

  static async getProfile(uid: string): Promise<{
    uid: string
    email: string
    name: string
    avatarUrl: string | null
    isAdmin: boolean
    createdAt: string | null
  }> {
    try {
      const data = await UserRepository.getById(uid)

      return {
        uid: data.uid,
        email: data.email,
        name: data.name ?? data.email.split('@')[0],
        avatarUrl: data.avatar_url,
        isAdmin: data.isAdmin ?? ADMIN_EMAILS.includes(data.email),
        createdAt: data.createdAt
      }
    } catch (error: any) {
      if (error.code === 'PGRST116') {
        const FullbackName = uid.split('@', 1)[0] ?? 'Anonymous'

        return {
          uid,
          email: uid.includes('@') ? uid : '',
          name: FullbackName,
          avatarUrl: null,
          isAdmin: ADMIN_EMAILS[0].includes(uid),
          createdAt: null
        }
      }

      throw error
    }
  }
}
