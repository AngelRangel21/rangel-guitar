'use server'

import { redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { adminCheck } from '@/app/[locale]/admin/artists/[slug]/edit/actions'
import { supabaseServer } from '@/lib/supabase/server'

export async function revalidateAndRedirectAfterEdit(songSlug: string) {
  const supabase = await supabaseServer()
  await adminCheck(supabase)
  const locale = await getLocale()
  redirect(`/${locale}/songs/${songSlug}`)
}
