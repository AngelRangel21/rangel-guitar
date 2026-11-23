import type { LucideIcon } from 'lucide-react'
import {
  GraduationCap,
  Heart,
  House,
  Inbox,
  MessageSquarePlus,
  Mic2,
  Upload
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { ComponentProps } from 'react'
import { useAuth } from '@/hooks/useAuth'
import type { Link } from '@/i18n/navigation'

type Href = ComponentProps<typeof Link>['href']

export interface NavLinkItem {
  href: Extract<Href, string>
  label: string
  title: string
  icon: LucideIcon
}

interface NavLinks {
  /** Enlaces visibles para todos. */
  main: NavLinkItem[]
  /** Enlaces de la cuenta del usuario (solo con sesión). */
  account: NavLinkItem[]
  /** Enlaces de administración (solo admins). */
  admin: NavLinkItem[]
}

/** Fuente única de los enlaces del header (escritorio y móvil). */
export function useNavLinks(): NavLinks {
  const t = useTranslations('header')
  const { isAuthenticated, isAdmin, user } = useAuth()
  const canAdmin = isAdmin || user?.role === 'admin'

  const main: NavLinkItem[] = [
    { href: '/', label: t('home.label'), title: t('home.title'), icon: House },
    {
      href: '/artists',
      label: t('artists.label'),
      title: t('artists.title'),
      icon: Mic2
    },
    {
      href: '/learn',
      label: t('learn.label'),
      title: t('learn.title'),
      icon: GraduationCap
    },
    {
      href: '/request-song',
      label: t('request.label'),
      title: t('request.title'),
      icon: MessageSquarePlus
    }
  ]

  const account: NavLinkItem[] = isAuthenticated
    ? [
        {
          href: '/favorites',
          label: t('favorites.label'),
          title: t('favorites.title'),
          icon: Heart
        }
      ]
    : []

  const admin: NavLinkItem[] = canAdmin
    ? [
        {
          href: '/admin/requests',
          label: t('requests.label'),
          title: t('requests.title'),
          icon: Inbox
        },
        {
          href: '/admin/upload-song',
          label: t('upload.label'),
          title: t('upload.title'),
          icon: Upload
        }
      ]
    : []

  return { main, account, admin }
}

/**
 * Indica si un enlace corresponde a la ruta actual. `pathname` es la ruta
 * interna de next-intl (p. ej. `/artists/[slug]`), sin locale.
 */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}
