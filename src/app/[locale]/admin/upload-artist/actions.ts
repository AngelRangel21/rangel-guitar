// src/app/[locale]/admin/add-song/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { supabaseServer } from '@/lib/supabase/server' // Ajusta esta ruta a tu helper de servidor

export async function uploadArtistAction(formData: FormData) {
  const supabase = await supabaseServer()

  // 2. Control de acceso estricto: Validar si el usuario es administrador en tu tabla 'users'
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('No autorizado. Debes iniciar sesión.')
  }

  const { data: userData, error: userError } = await supabase
    .from('users') // Tu tabla personalizada de usuarios
    .select('role')
    .eq('uid', user.id)
    .single()

  if (userError || userData?.role !== 'admin') {
    throw new Error('No autorizado. Se requieren permisos de administrador.')
  }

  // 3. Extraer y validar los campos enviados desde el cliente
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const imageFile = formData.get('image') as File

  if (!name || !slug || !imageFile) {
    throw new Error('Todos los campos son obligatorios, incluyendo la imagen.')
  }

  // 4. Preparar el nombre de archivo estandarizado
  const fileExtension = imageFile.name.split('.').pop()
  const fileName = `${slug}.${fileExtension}`
  const filePath = fileName // Raíz de tu bucket tal como lo probaste con éxito

  // 5. Convertir el archivo File a Buffer para guardarlo en el almacenamiento del servidor
  const arrayBuffer = await imageFile.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // 6. Subir la imagen al Storage de Supabase de manera segura
  const { error: storageError } = await supabase.storage
    .from('artist-image') // Tu bucket exacto
    .upload(filePath, buffer, {
      contentType: imageFile.type,
      upsert: true
    })

  if (storageError) {
    throw new Error(`Error en Storage: ${storageError.message}`)
  }

  // 7. Insertar el registro en la base de datos de forma limpia
  const { error: dbError } = await supabase.from('artists').insert({
    name,
    slug,
    image_url: fileName // Guarda únicamente el nombre de archivo (ej: 'peso-pluma.webp')
  })

  // 8. Reversión manual en caso de que la DB falle para no dejar archivos basura
  if (dbError) {
    await supabase.storage.from('artist-image').remove([filePath])
    throw new Error(`Error en Base de Datos: ${dbError.message}`)
  }

  // 9. Revalidar la caché para refrescar los datos en el frontend
  revalidatePath('/artists')

  return { success: true }
}
