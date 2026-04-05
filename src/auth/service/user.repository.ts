// user.repository.ts
import { supabase } from '@/lib/supabase'
import { Tables } from '@/types'

type User = Tables<'users'>

export class UserRepository {
  static async upsert (user: {
    uid: string
    email: string
    name: string
    avatar_url: string | null
    isAdmin: boolean
  }): Promise<void> {
    const { error } = await supabase
      .from('users')
      .upsert(user, {
        onConflict: 'uid',
        ignoreDuplicates: false
      })

    if (error != null) throw error
  }

  static async getById (uid: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .select('uid, email, name, role, avatar_url, createdAt, isAdmin')
      .eq('uid', uid)
      .single()

    if (error != null) throw error
    return data
  }
}
