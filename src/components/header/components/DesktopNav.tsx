import { ThemeToggle } from '@/components/theme-toggle'
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
  const baseLinks = [
    { href: '/', label: 'Inicio', title: 'Titulo Pagina Principal' },
    { href: '/artists', label: 'Artistas', title: 'Pagina artistas' },
    // {
    //   href: '/top-charts',
    //   label: 'Top canciones',
    //   title: 'Pagina top canciones'
    // },
    {
      href: '/request-song',
      label: 'Solicitar',
      title: 'Pagina de solicitar canción'
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
      title: 'Pagina para subir canción'
    }
  ]

  // Selecciona qué links mostrar según el rol
  const navLinks = isAdmin ? adminLinks : userLinks

  return (
    <>
      <nav className='hidden xl:flex items-center gap-0'>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className='px-3 py-1 text-xs text-foreground hover:bg-primary hover:text-primary-foreground'
            title={link.title}
            style={{ fontFamily: "'Tahoma', 'MS Sans Serif', sans-serif" }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Desktop Actions */}
      <section className='hidden xl:flex items-center gap-1'>
        {isAdmin && (
          <Link
            href='/admin/requests'
            className='win-button flex items-center gap-1 text-xs relative'
            title='Solicitudes'
          >
            <Bell size={12} />
            {notifications.count > 0 && (
              <span style={{ background: '#c0392b', color: '#fff', borderRadius: '50%', width: '14px', height: '14px', fontSize: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', position: 'absolute', top: '-4px', right: '-4px' }}>
                {notifications.count}
              </span>
            )}
          </Link>
        )}
        <ThemeToggle />
        {isAuthenticated
          ? (
            <button
              className='win-button text-xs'
              onClick={logout}
            >
              Cerrar sesión
            </button>
            )
          : (
            <div className='flex gap-1'>
              <Link href='/login' className='win-button text-xs' style={{ textDecoration: 'none' }}>
                Iniciar sesión
              </Link>
              <Link href='/register' className='win-button text-xs' style={{ textDecoration: 'none' }}>
                Registrarse
              </Link>
            </div>
            )}
      </section>
    </>
  )
}
