/** biome-ignore-all lint/complexity/noStaticOnlyClass: explain */
/** biome-ignore-all lint/suspicious/noExplicitAny: explain */
import type { User } from '@supabase/supabase-js'
import type { DbUser, Roles } from '@/types/app.types'
import { UserRepository } from './user.repository'

export class UserService {
  static buildProfile(user: User, displayName?: string) {
    const name =
      displayName ??
      user.user_metadata?.full_name ??
      user.user_metadata?.name ??
      user.email?.split('@')[0] ??
      'Anonymous'

    const avatar_url = user.user_metadata?.avatar_url ?? null

    return {
      uid: user.id,
      email: user.email ?? '',
      name,
      avatar_url,
      role: 'user'
    }
  }

  static async getProfile(uid: string): Promise<DbUser> {
    try {
      const data = await UserRepository.getById(uid)

      return {
        ...data,
        role: data.role as Roles
      }
    } catch (error: any) {
      if (error.code === 'PGRST116') {
        const FullbackName = uid.split('@', 1)[0] ?? 'Anonymous'

        return {
          uid,
          email: '',
          name: FullbackName,
          avatar_url: null,
          role: 'user',
          createdAt: null
        }
      }

      throw error
    }
  }
}
