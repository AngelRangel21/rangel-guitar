import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { SongRequest } from '@/lib/types'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState, JSX } from 'react'

export default function DesktopNav (): JSX.Element {
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

      if (error) {
        console.error('Error fetching initial song requests:', error)
        return
      }

      setNotifications({
        count: requests.length,
        recentRequests: requests
          .slice(0, 99)
          .map((r) => ({ ...r, requestedAt: new Date(r.requestedAt) })),
      })
    }

    fetchInitialRequests()

    const channel = supabase
      .channel('song-requests-chanel')
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
  const baseLinks = [
    { href: '/', label: 'Inicio', title: 'Titulo Pagina Principal' },
    { href: '/artists', label: 'Artistas', title: 'Pagina artistas' },
    {
      href: '/top-charts',
      label: 'Top canciones',
      title: 'Pagina top canciones'
    },
    {
      href: '/request-song',
      label: 'Solicitar',
      title: 'Pagina de solicitar cancion'
    },
    { href: '/learn', label: 'Aprender', title: 'Pagina para aprender' }
  ]

  // Enlaces adicionales según el tipo de usuario
  const userLinks = isAuthenticated
    ? [
        ...baseLinks,
        {
          href: '/favorites',
          label: 'Favoritos',
          title: 'Pagina de favoritos'
        }
      ]
    : baseLinks
  const adminLinks = [
    ...userLinks,
    {
      href: '/admin/requests',
      label: 'Solicitudes',
      title: 'Pagina de solicitudes canciones'
    },
    {
      href: '/admin/upload-song',
      label: 'Subir',
      title: 'Pagina para subir cancion'
    }
  ]

  // Selecciona qué links mostrar según el rol
  const navLinks = isAdmin ? adminLinks : userLinks

  return (
    <>
      <nav className='hidden xl:flex gap-6'>
        {navLinks.map((link) => (
          <Link
            key={link.href}
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
            title='Solicitudes'
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
              Cerrar sesión
            </Button>
          </div>
        ) : (
          <div className='hidden xl:flex gap-2'>
            <Link
              href='/login'
              className='font-semibold rounded-[8px] py-3 px-[10px] hover:text-[#d2d2d2]'
            >
              Iniciar sesión
            </Link>
            <Link
              href='/register'
              className='font-semibold rounded-[8px] py-3 px-[10px] border-white hover:text-[#d2d2d2]'
            >
              Registrarse
            </Link>
          </div>
        )}
      </section>
    </>
  )
}
