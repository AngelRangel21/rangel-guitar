'use client'

import { useTranslations } from 'next-intl'
import type { JSX } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuth } from '@/hooks/useAuth'
import { Link } from '@/i18n/navigation'
import { DesktopNav } from './components/DesktopNav'
import { Logo } from './components/Logo'
import { MobileNav } from './components/MobileNav'
import { Notifications } from './components/Notifications'
import { UserMenu } from './components/UserMenu'

export function Header(): JSX.Element {
  const t = useTranslations('header')
  const { isAuthenticated } = useAuth()

  return (
    <header className='sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/65'>
      <div className='container mx-auto grid h-16 grid-cols-[1fr_auto] items-center gap-4 px-4 lg:grid-cols-[1fr_auto_1fr]'>
        <div className='flex min-w-0 items-center'>
          <Logo />
        </div>

        <DesktopNav />

        <div className='flex items-center justify-end gap-1'>
          {/* Se monta una sola vez para no abrir dos canales de Supabase. */}
          <Notifications />

          <div className='hidden items-center gap-2 lg:flex'>
            <ThemeToggle />
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Link
                  href='/login'
                  className='inline-flex h-9 items-center rounded-full px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted'
                >
                  {t('login')}
                </Link>
                <Link
                  href='/register'
                  className='inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85'
                >
                  {t('register')}
                </Link>
              </>
            )}
          </div>

          <MobileNav />
        </div>
      </div>
    </header>
  )
}
