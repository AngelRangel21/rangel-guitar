'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { supabaseServer } from '@/lib/supabase/server'

type SupabaseClient = Awaited<ReturnType<typeof supabaseServer>>

async function adminCheck(supabase: SupabaseClient) {
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('No autorizado. Debes iniciar sesión.')
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('uid', user.id)
    .single()

  if (userError || userData?.role !== 'admin') {
    throw new Error('No autorizado. Se requieren permisos de administrador.')
  }
}

export async function updateArtistAction(formData: FormData) {
  const supabase = await supabaseServer()
  await adminCheck(supabase)

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const imageFile = formData.get('image') as File | null

  if (!id || !name || !slug) {
    throw new Error('ID, nombre y slug son obligatorios.')
  }

  const updates: { name: string; slug: string; image_url?: string } = {
    name,
    slug
  }

  if (imageFile && imageFile.size > 0) {
    const fileExtension = imageFile.name.split('.').pop()
    const fileName = `${slug}.${fileExtension}`
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: storageError } = await supabase.storage
      .from('artist-image')
      .upload(fileName, buffer, {
        contentType: imageFile.type,
        upsert: true
      })

    if (storageError) {
      throw new Error(`Error en Storage: ${storageError.message}`)
    }

    updates.image_url = fileName
  }

  const { error: dbError } = await supabase
    .from('artists')
    .update(updates)
    .eq('id', id)

  if (dbError) {
    throw new Error(`Error en Base de Datos: ${dbError.message}`)
  }

  revalidatePath('/artists')
  revalidatePath(`/artists/${slug}`)
  revalidatePath('/admin/artists')
}

export async function redirectAfterEdit() {
  const locale = await getLocale()
  redirect(`/${locale}/admin/artists`)
}
