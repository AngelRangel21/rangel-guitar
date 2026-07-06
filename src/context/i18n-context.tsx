/** biome-ignore-all lint/suspicious/noExplicitAny: explain */
'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'

export function useI18n() {
  const t = useTranslations()
  const language = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const setLanguage = (nextLocale: string) => {
    router.replace(pathname as any, { locale: nextLocale as any })
  }
  return { language, setLanguage, t }
}
