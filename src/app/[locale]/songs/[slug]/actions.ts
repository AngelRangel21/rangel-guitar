'use server'

import { revalidatePath } from 'next/cache'
import { getLocale } from 'next-intl/server'
import { redirect } from '@/i18n/navigation'
import { supabaseServer } from '@/lib/supabase/server'

/**
 * Acción de servidor que se ejecuta después de eliminar una canción.
 * Revalida todas las rutas relevantes y redirige al usuario a la página de inicio.
 */
export async function revalidateAndRedirectAfterDelete() {
  const supabase = await supabaseServer()

  const {
    data: { user }
  } = await supabase.auth.getUser()
  const userRole = user?.app_metadata?.role || 'user'

  if (!user || userRole !== 'admin') {
    throw new Error(
      'No autorizado. Solo los administradores pueden eliminar contenido.'
    )
  }

  const locale = await getLocale()
  revalidatePath('/')
  // Redirige al usuario a la página de inicio.
  redirect({
    href: '/',
    locale: locale
  })
}
