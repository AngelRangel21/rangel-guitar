import { LogOut, Menu } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type JSX, useState } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { useAuth } from '@/hooks/useAuth'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import {
  isActivePath,
  type NavLinkItem,
  useNavLinks
} from '../hooks/use-nav-links'
import { AvatarUser } from './AvatarUser'

interface NavSectionProps {
  title?: string
  links: NavLinkItem[]
  pathname: string
  onNavigate: () => void
}

function NavSection({
  title,
  links,
  pathname,
  onNavigate
}: NavSectionProps): JSX.Element | null {
  if (links.length === 0) return null

  return (
    <div className='space-y-1'>
      {title != null && (
        <p className='px-3 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground'>
          {title}
        </p>
      )}
      <ul className='space-y-0.5'>
        {links.map((link) => {
          const isActive = isActivePath(pathname, link.href)
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                title={link.title}
                onClick={onNavigate}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                )}
              >
                <link.icon aria-hidden='true' className='size-5' />
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Menú lateral para móvil y tablet. */
export function MobileNav(): JSX.Element {
  const t = useTranslations('header')
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuth()
  const { main, account, admin } = useNavLinks()
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={t('openMenu')}
        title={t('openMenu')}
        className='inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden'
      >
        <Menu aria-hidden='true' className='size-6' />
      </SheetTrigger>

      <SheetContent side='right' className='w-[85%] gap-0 p-0 sm:max-w-sm'>
        <div className='border-b p-5 pr-14'>
          <SheetTitle className='text-lg font-bold'>{t('menu')}</SheetTitle>
          <SheetDescription className='sr-only'>
            {t('navigation')}
          </SheetDescription>
        </div>

        <div className='flex-1 space-y-6 overflow-y-auto p-4'>
          {/* Cuenta */}
          {isAuthenticated && user != null ? (
            <div className='flex items-center gap-3 rounded-2xl border bg-muted/40 p-3'>
              <AvatarUser />
              <div className='min-w-0'>
                <p className='truncate font-semibold'>
                  {user.name ?? t('myAccount')}
                </p>
                <p className='truncate text-sm text-muted-foreground'>
                  {user.email}
                </p>
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-2 gap-2'>
              <Link
                href='/login'
                onClick={close}
                className='inline-flex h-10 items-center justify-center rounded-xl border text-sm font-semibold transition-colors hover:bg-muted'
              >
                {t('login')}
              </Link>
              <Link
                href='/register'
                onClick={close}
                className='inline-flex h-10 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85'
              >
                {t('register')}
              </Link>
            </div>
          )}

          <nav aria-label={t('navigation')} className='space-y-6'>
            <NavSection links={main} pathname={pathname} onNavigate={close} />
            <NavSection
              title={t('myAccount')}
              links={account}
              pathname={pathname}
              onNavigate={close}
            />
            <NavSection
              title={t('admin')}
              links={admin}
              pathname={pathname}
              onNavigate={close}
            />
          </nav>
        </div>

        <div className='space-y-2 border-t p-4'>
          <div className='flex items-center justify-between px-3'>
            <span className='text-sm font-medium text-muted-foreground'>
              {t('teme')}
            </span>
            <ThemeToggle />
          </div>
          {isAuthenticated && (
            <button
              type='button'
              onClick={() => {
                logout()
                close()
              }}
              className='flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-base font-medium text-destructive transition-colors hover:bg-destructive/10'
            >
              <LogOut aria-hidden='true' className='size-5' />
              {t('logout')}
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
