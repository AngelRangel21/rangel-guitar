import { LogOut } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { JSX } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { Link } from '@/i18n/navigation'
import { useNavLinks } from '../hooks/use-nav-links'
import { AvatarUser } from './AvatarUser'

/** Menú desplegable de la cuenta (escritorio). */
export function UserMenu(): JSX.Element {
  const t = useTranslations('header')
  const { user, logout } = useAuth()
  const { account, admin } = useNavLinks()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('accountMenu')}
        title={t('accountMenu')}
        className='rounded-full outline-none ring-offset-2 ring-offset-background transition-shadow hover:ring-2 hover:ring-border focus-visible:ring-2 focus-visible:ring-ring'
      >
        <AvatarUser />
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' sideOffset={8} className='w-60'>
        <DropdownMenuGroup>
          <DropdownMenuLabel className='flex flex-col gap-0.5'>
            <span className='truncate text-sm font-semibold text-foreground'>
              {user?.name ?? t('myAccount')}
            </span>
            {user?.email != null && (
              <span className='truncate'>{user.email}</span>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        {account.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {account.map((link) => (
                <DropdownMenuItem
                  key={link.href}
                  render={<Link href={link.href} title={link.title} />}
                >
                  <link.icon aria-hidden='true' />
                  {link.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </>
        )}

        {admin.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>{t('admin')}</DropdownMenuLabel>
              {admin.map((link) => (
                <DropdownMenuItem
                  key={link.href}
                  render={<Link href={link.href} title={link.title} />}
                >
                  <link.icon aria-hidden='true' />
                  {link.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem variant='destructive' onClick={logout}>
          <LogOut aria-hidden='true' />
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
