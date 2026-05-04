import { useTranslations } from 'next-intl'
import type { ComponentProps, JSX } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { Link } from '@/i18n/navigation'
import { AvatarUser } from './AvatarUser'
import { Notifications } from './Notifications'

interface NavLink {
  href: ComponentProps<typeof Link>['href']
  label: string
  title: string
}

export default function DesktopNav(): JSX.Element {
  const t = useTranslations('header')
  const { isAuthenticated, isAdmin, logout } = useAuth()

  // Enlaces base para todos los usuarios
  const baseLinks: NavLink[] = [
    { href: '/', label: t('home.label'), title: t('home.title') },
    { href: '/artists', label: t('artists.label'), title: t('artists.title') },
    // TODO: agregar las canciones top por me gusta
    // {
    //   href: '/top-charts',
    //   label: 'Top canciones',
    //   title: 'Pagina top canciones'
    // },
    {
      href: '/request-song',
      label: t('request.label'),
      title: t('request.title')
    },
    { href: '/learn', label: t('learn.label'), title: t('learn.title') }
  ]

  // Enlaces adicionales según el tipo de usuario
  const userLinks: NavLink[] = isAuthenticated
    ? [
        ...baseLinks,
        {
          href: '/favorites',
          label: t('favorites.label'),
          title: t('favorites.title')
        }
      ]
    : baseLinks
  const adminLinks: NavLink[] = [
    ...userLinks,
    {
      href: '/admin/requests',
      label: t('requests.label'),
      title: t('requests.title')
    },
    {
      href: '/admin/upload-song',
      label: t('upload.label'),
      title: t('upload.title')
    }
  ]

  // Selecciona qué links mostrar según el rol
  const navLinks = isAdmin ? adminLinks : userLinks

  return (
    <>
      <nav className='hidden xl:flex gap-6'>
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className='hover:text-[#d2d2d2] transition-colors font-medium'
            title={link.title}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* --- Desktop Actions --- */}
      <section className='hidden xl:flex items-center gap-3'>
        <Notifications />
        {/* Tema modo claro/obscuro */}
        <ThemeToggle />

        {isAuthenticated ? (
          <div className='hidden xl:flex'>
            <Button
              variant='secondary'
              size='sm'
              onClick={logout}
              className='font-semibold'
            >
              {t('logout')}
            </Button>

            <span className='hidden xl:flex ml-4 items-center'>
              <AvatarUser />
            </span>
          </div>
        ) : (
          <div className='hidden xl:flex gap-2'>
            <Link
              href='/login'
              className='font-semibold rounded-[8px] py-3 px-2.5 hover:text-[#d2d2d2]'
            >
              {t('login')}
            </Link>
            <Link
              href='/register'
              className='font-semibold rounded-[8px] py-3 px-2.5 border-white hover:text-[#d2d2d2]'
            >
              {t('register')}
            </Link>
          </div>
        )}
      </section>
    </>
  )
}
