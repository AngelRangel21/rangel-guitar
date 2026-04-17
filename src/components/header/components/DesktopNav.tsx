import { Bell } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type ComponentProps, type JSX, useEffect, useState } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { Link } from '@/i18n/navigation'
import { supabase } from '@/lib/supabase'
import type { SongRequest } from '@/lib/types'

interface NavLink {
  href: ComponentProps<typeof Link>['href']
  label: string
  title: string
}

export default function DesktopNav(): JSX.Element {
  const t = useTranslations('header')
  const { isAuthenticated, isAdmin, logout } = useAuth()
  const [notifications, setNotifications] = useState<{
    count: number
    recentRequests: SongRequest[]
  }>({ count: 0, recentRequests: [] })

  useEffect(() => {
    if (!isAdmin) {
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
        {isAdmin && (
          <Link
            href='/admin/requests'
            className='inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors size-10 relative hover:bg-primary-foreground/10 rounded-full'
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
