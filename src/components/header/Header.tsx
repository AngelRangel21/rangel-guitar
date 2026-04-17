'use client'

import { Bell, FilePlus2, Heart, Menu, Shield, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type ComponentProps, type JSX, useEffect, useState } from 'react'
import { useAuth, useAuthStatus } from '@/hooks/useAuth'
import { Link } from '@/i18n/navigation'
import { supabase } from '@/lib/supabase'
import type { SongRequest } from '@/lib/types'
import { ThemeToggle } from '../theme-toggle'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Button } from '../ui/button'
import DesktopNav from './components/DesktopNav'
import { Logo } from './components/Logo'

interface NavLink {
  href: ComponentProps<typeof Link>['href']
  label: string
  title: string
}

export function Header(): JSX.Element {
  const t = useTranslations('header')
  const { logout, user } = useAuth()
  const { isAuthenticated, isAdmin } = useAuthStatus()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifications, setNotifications] = useState<{
    count: number
    recentRequests: SongRequest[]
  }>({ count: 0, recentRequests: [] })

  useEffect(() => {
    if (isAdmin === null || !isAdmin) {
      setNotifications({ count: 0, recentRequests: [] })
      return // No hacer nada si el usuario no es administrador.
    }

    const fetchInitialRequests = async () => {
      const { data: requests, error } = await supabase
        .from('songs_requests')
        .select('*')
        .order('requestedAt', { ascending: false })

      if (error != null) {
        console.error('Error fetching initial song requests:', error)
        return
      }

      setNotifications({
        count: requests.length,
        recentRequests: requests
          .slice(0, 99)
          .map((r) => ({ ...r, requestedAt: new Date(r.requestedAt) }))
      })
    }

    fetchInitialRequests()

    const channel = supabase
      .channel('song-requests-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'songs_requests' },
        () => {
          fetchInitialRequests() // Re-fetch all requests on any change
        }
      )
      .subscribe()

    // Limpia el listener cuando el componente se desmonta para evitar fugas de memoria.
    return () => {
      supabase.removeChannel(channel)
    }
  }, [isAdmin])

  // Enlaces base para todos los usuarios
  const baseLinks: NavLink[] = [
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
      label: t('request.label'),
      title: t('request.title')
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
    <header className='bg-primary text-primary-foreground sticky top-0 z-50 backdrop-filter backdrop-blur-xs'>
      <div className='container mx-auto flex items-center justify-between px-4 h-16'>
        {/* Logo */}
        <Logo />

        {/* --- Desktop Navigation --- */}
        <DesktopNav />

        {/* --- Mobile Menu Button --- */}
        <section className='flex'>
          {isAdmin && (
            <Link
              href='/admin/requests'
              className='xl:hidden flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors h-10 w-10 rounded-full mr-4 size-10 relative hover:bg-primary-foreground/10'
              title={t('request.title')}
            >
              <Bell />
              {notifications.count > 0 && (
                <span className='absolute top-0 right-1 flex size-5 items-center justify-center rounded-full bg-destructive p-1 text-xs font-bold text-destructive-foreground'>
                  {notifications.count}
                </span>
              )}
            </Link>
          )}
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
                <Avatar className='h-6 w-6'>
                  <AvatarFallback>
                    {user?.avatarUrl ?? user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )
            ) : mobileOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <Menu className='h-6 w-6' />
            )}
          </Button>
        </section>
      </div>

      {/* --- Mobile Navigation --- */}
      {mobileOpen && (
        <div className='xl:hidden bg-primary text-primary-foreground border-t border-primary-foreground/10 w-full absolute'>
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
              <>
                {isAdmin && (
                  <>
                    <Link
                      href='/admin/requests'
                      className='block py-2 px-3 rounded-md hover:bg-primary-foreground/10'
                      onClick={() => setMobileOpen(false)}
                    >
                      <Shield className='inline mr-2 h-4 w-4' />{' '}
                      {t('request.label')}
                    </Link>
                    <Link
                      href='/admin/upload-song'
                      className='block py-2 px-3 rounded-md hover:bg-primary-foreground/10'
                      onClick={() => setMobileOpen(false)}
                    >
                      <FilePlus2 className='inline mr-2 h-4 w-4' />{' '}
                      {t('upload.label')}
                    </Link>
                  </>
                )}
                <Link
                  href='/favorites'
                  className='block py-2 px-3 rounded-md hover:bg-primary-foreground/10'
                  onClick={() => setMobileOpen(false)}
                >
                  <Heart className='inline mr-2 h-4 w-4' />{' '}
                  {t('favorites.label')}
                </Link>
                <Button
                  onClick={() => {
                    logout()
                    setMobileOpen(false)
                  }}
                  className='block py-2 px-3 text-left rounded-md hover:bg-primary-foreground/10 font-semibold'
                >
                  {t('logout')}
                </Button>
              </>
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

            <div className='border-t border-primary-foreground/10 my-2' />
            <div className='flex justify-between items-center px-3'>
              <span className='text-sm'>{t('teme')}</span>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
