'use client'

import {
  Inbox,
  type LucideIcon,
  Mic2,
  ShieldCheck,
  Upload,
  UserPlus
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { JSX, ReactNode } from 'react'
import { PageShell } from '@/components/layout/page-header'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface AdminLink {
  href:
    | '/admin/requests'
    | '/admin/upload-song'
    | '/admin/upload-artist'
    | '/admin/artists'
  label: string
  icon: LucideIcon
}

/**
 * Layout común del área de administración: cabecera con pestañas para
 * moverse entre secciones y el contenido de cada página debajo.
 */
export function AdminShell({ children }: { children: ReactNode }): JSX.Element {
  const t = useTranslations('adminShell')
  const pathname = usePathname()

  const links: AdminLink[] = [
    { href: '/admin/requests', label: t('requests'), icon: Inbox },
    { href: '/admin/upload-song', label: t('uploadSong'), icon: Upload },
    { href: '/admin/upload-artist', label: t('uploadArtist'), icon: UserPlus },
    { href: '/admin/artists', label: t('artists'), icon: Mic2 }
  ]

  return (
    <PageShell className='space-y-6'>
      <header className='flex flex-col gap-5 rounded-3xl border bg-linear-to-b from-muted/60 to-background p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between'>
        <div className='space-y-2'>
          <p className='inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground'>
            <ShieldCheck aria-hidden='true' className='size-3.5' />
            {t('eyebrow')}
          </p>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-headline'>
            {t('title')}
          </h1>
        </div>

        <nav aria-label={t('navLabel')} className='-mx-1 overflow-x-auto px-1'>
          <ul className='flex w-max items-center gap-1 rounded-full border bg-muted/40 p-1'>
            {links.map(({ href, label, icon: Icon }) => {
              const isActive =
                pathname === href || pathname.startsWith(`${href}/`)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isActive
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon aria-hidden='true' className='size-4' />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </header>

      {children}
    </PageShell>
  )
}
