import { useTranslations } from 'next-intl'
import type { JSX } from 'react'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { isActivePath, useNavLinks } from '../hooks/use-nav-links'

/** Navegación principal en escritorio, con el enlace activo resaltado. */
export function DesktopNav(): JSX.Element {
  const t = useTranslations('header')
  const pathname = usePathname()
  const { main } = useNavLinks()

  return (
    <nav aria-label={t('navigation')} className='hidden lg:block'>
      <ul className='flex items-center gap-1 rounded-full border bg-muted/40 p-1'>
        {main.map((link) => {
          const isActive = isActivePath(pathname, link.href)
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                title={link.title}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'inline-flex h-8 items-center rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
