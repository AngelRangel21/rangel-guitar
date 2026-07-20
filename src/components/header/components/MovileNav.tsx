import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { type ComponentProps, useState } from 'react'
// import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { AvatarUser } from './AvatarUser'
import { Notifications } from './Notifications'

interface NavLink {
  href: ComponentProps<typeof Link>['href']
  label: string
  title: string
}

export function MovileNav() {
  const t = useTranslations('header')
  const { logout, user, isAuthenticated, isAdmin } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Enlaces base para todos los usuarios
  const navLinks: NavLink[] = [
    { href: '/', label: t('home.label'), title: t('home.title') },
    { href: '/artists', label: t('artists.label'), title: t('artists.title') },
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
  if (isAuthenticated) {
    navLinks.push({
      href: '/favorites',
      label: t('favorites.label'),
      title: t('favorites.title')
    })
  }

  if (isAdmin || user?.role === 'admin') {
    navLinks.push(
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
    )
  }

  return (
    <>
      <section className='flex gap-2 lg:hidden'>
        <Notifications />
        <Button
          onClick={() => setMobileOpen(!mobileOpen)}
          className='xl:hidden flex items-center justify-center h-10 w-10 rounded-md hover:bg-primary-foreground/10'
          title='Mostrar Menú'
          aria-label='Mostrar Menú'
        >
          {/* TODO: Obtener la imagen del usuario para mostrar en el menu si esta autenticado */}
          {isAuthenticated && user != null ? (
            mobileOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <AvatarUser />
            )
          ) : mobileOpen ? (
            <X className='h-6 w-6' />
          ) : (
            <Menu className='h-6 w-6' />
          )}
        </Button>
      </section>

      {/* --- Mobile Navigation --- */}
      {mobileOpen && (
        <div className='xl:hidden bg-primary text-primary-foreground border-t border-primary-foreground/10 w-full absolute left-0 top-full'>
          <nav className='flex flex-col space-y-2 p-4'>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className='block py-2 px-3 rounded-md hover:bg-primary-foreground/10 font-medium'
                onClick={() => setMobileOpen(false)}
                title={link.title}
              >
                {link.label}
              </Link>
            ))}

            <div className='border-t border-primary-foreground/10 my-2' />

            {isAuthenticated ? (
              <Button
                onClick={() => {
                  logout()
                  setMobileOpen(false)
                }}
                className='block py-2 px-3 text-left rounded-md hover:bg-primary-foreground/10 font-semibold'
              >
                {t('logout')}
              </Button>
            ) : (
              <>
                <Link
                  href='/login'
                  className='block py-2 px-3 rounded-md hover:bg-primary-foreground/10 font-semibold'
                  onClick={() => setMobileOpen(false)}
                >
                  {t('login')}
                </Link>
                <Link
                  href='/register'
                  className='block py-2 px-3 rounded-md hover:bg-primary-foreground/10 font-semibold'
                  onClick={() => setMobileOpen(false)}
                >
                  {t('register')}
                </Link>
              </>
            )}

            {/* <div className='border-t border-primary-foreground/10 my-2' />
            <div className='flex justify-between items-center px-3'>
              <span className='text-sm'>{t('teme')}</span>
              <ThemeToggle />
            </div> */}
          </nav>
        </div>
      )}
    </>
  )
}
