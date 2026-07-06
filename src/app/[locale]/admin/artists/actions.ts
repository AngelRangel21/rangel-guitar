'use server'

import { revalidatePath } from 'next/cache'
import { supabaseServer } from '@/lib/supabase/server'

export async function deleteArtistAction(formData: FormData) {
  const supabase = await supabaseServer()

  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('No autorizado.')
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('uid', user.id)
    .single()

  if (userError || userData?.role !== 'admin') {
    throw new Error('No autorizado.')
  }

  const id = formData.get('id') as string
  const imageUrl = formData.get('image_url') as string | null

  if (!id) {
    throw new Error('ID es obligatorio.')
  }

  const { error: dbError } = await supabase
    .from('artists')
    .delete()
    .eq('id', id)

  if (dbError) {
    throw new Error(`Error al eliminar: ${dbError.message}`)
  }

  if (imageUrl) {
    await supabase.storage.from('artist-image').remove([imageUrl])
  }

  revalidatePath('/artists')
  revalidatePath('/admin/artists')
}
