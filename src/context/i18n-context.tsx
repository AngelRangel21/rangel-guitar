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
    // Conserva los search params (por ejemplo `?q=` en la página de búsqueda)
    // al cambiar de idioma. Se lee en el handler para no depender de
    // `useSearchParams` en un provider montado en todas las páginas.
    const query =
      typeof window === 'undefined'
        ? undefined
        : Object.fromEntries(new URLSearchParams(window.location.search))

    router.replace({ pathname, query } as any, { locale: nextLocale as any })
  }
  return { language, setLanguage, t }
}
