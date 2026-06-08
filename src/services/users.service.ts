import { supabase } from '@/lib/supabase'

export function getUserImage(user: string) {
  const { data } = supabase.storage.from('users-images').getPublicUrl(user)
  return data.publicUrl
}
