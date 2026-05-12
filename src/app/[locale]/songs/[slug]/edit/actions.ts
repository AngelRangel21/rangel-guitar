'use server'

import { redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'

export async function revalidateAndRedirectAfterEdit(songSlug: string) {
  const locale = await getLocale()
  redirect(`/${locale}/songs/${songSlug}`)
}
