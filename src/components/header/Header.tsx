'use client'

import Link from 'next/link'
import { useState, useEffect, JSX } from 'react'
import { Menu, X, Bell, Heart, Shield, FilePlus2 } from 'lucide-react'
import { useAuth, useAuthStatus } from '@/hooks/useAuth'
import { ThemeToggle } from '../theme-toggle'
import { Logo } from './components/Logo'
import DesktopNav from './components/DesktopNav'
import type { SongRequest } from '@/lib/types'
import { supabase } from '@/lib/supabase'

export function Header (): JSX.Element {
  const { logout } = useAuth()
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
  const adminLinks = isAdmin
    ? [
        ...userLinks,
        {
          href: '/admin/requests',
          label: 'Solicitudes',
          title: 'Pagina de solicitudes de canciones'
        },
        {
          href: '/admin/upload-song',
          label: 'Subir',
          title: 'Pagina para subir canción'
        }
      ]
    : userLinks

  // Selecciona qué links mostrar según el rol
  const navLinks = isAdmin ? adminLinks : userLinks

  return (
    <header className='sticky top-0 z-50' style={{ background: '#d4d0c8', borderBottom: '2px solid', borderColor: '#ffffff #404040 #404040 #ffffff', boxShadow: 'inset -1px -1px 0 #808080, inset 1px 1px 0 #f0f0f0' }}>
      {/* Win2K Title Bar */}
      <div className='win-title-bar px-2 py-1'>
        <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0px' }}>🎸 Rangel Guitar — Tablaturas y Acordes</span>
        <div className='ml-auto flex gap-1'>
          <span style={{ background: '#d4d0c8', color: '#000', border: '2px solid', borderColor: '#ffffff #404040 #404040 #ffffff', boxShadow: 'inset -1px -1px 0 #808080', width: '16px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', cursor: 'default', fontWeight: 'bold' }}>_</span>
          <span style={{ background: '#d4d0c8', color: '#000', border: '2px solid', borderColor: '#ffffff #404040 #404040 #ffffff', boxShadow: 'inset -1px -1px 0 #808080', width: '16px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', cursor: 'default' }}>□</span>
          <span style={{ background: '#c0392b', color: '#fff', border: '2px solid', borderColor: '#ffffff #404040 #404040 #ffffff', boxShadow: 'inset -1px -1px 0 #808080', width: '16px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', cursor: 'default', fontWeight: 'bold' }}>✕</span>
        </div>
      </div>

      {/* Win2K Menu Bar */}
      <div className='win-menu-bar px-1'>
        <div className='container mx-auto flex items-center justify-between px-2 h-8'>
          <Logo />

          {/* Desktop Navigation */}
          <DesktopNav />

          {/* Mobile Menu Button */}
          <section className='flex xl:hidden items-center gap-1'>
            {isAdmin && (
              <Link
                href='/admin/requests'
                className='win-button flex items-center gap-1 text-xs'
                title='Solicitudes'
                style={{ padding: '2px 6px', position: 'relative' }}
              >
                <Bell size={12} />
                {notifications.count > 0 && (
                  <span style={{ background: '#c0392b', color: '#fff', borderRadius: '50%', width: '14px', height: '14px', fontSize: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {notifications.count}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className='win-button'
              style={{ padding: '2px 6px' }}
              title='Mostrar Menú'
              aria-label='Mostrar Menú'
            >
              {mobileOpen ? <X size={12} /> : <Menu size={12} />}
            </button>
          </section>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileOpen && (
        <div className='xl:hidden w-full absolute' style={{ background: '#d4d0c8', borderBottom: '2px solid', borderColor: '#ffffff #404040 #404040 #ffffff', boxShadow: '2px 2px 4px rgba(0,0,0,0.4)', zIndex: 100 }}>
          <nav className='flex flex-col p-2 gap-0.5'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='block py-1 px-2 text-xs text-foreground hover:bg-primary hover:text-primary-foreground'
                onClick={() => setMobileOpen(false)}
                title={link.title}
              >
                {link.label}
              </Link>
            ))}

            <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid #ffffff', margin: '4px 0' }} />

            {isAuthenticated
              ? (
                <>
                  {isAdmin && (
                    <>
                      <Link href='/admin/requests' className='block py-1 px-2 text-xs hover:bg-primary hover:text-primary-foreground' onClick={() => setMobileOpen(false)}>
                        <Shield className='inline mr-1' size={11} /> Solicitudes
                      </Link>
                      <Link href='/admin/upload-song' className='block py-1 px-2 text-xs hover:bg-primary hover:text-primary-foreground' onClick={() => setMobileOpen(false)}>
                        <FilePlus2 className='inline mr-1' size={11} /> Subir
                      </Link>
                    </>
                  )}
                  <Link href='/favorites' className='block py-1 px-2 text-xs hover:bg-primary hover:text-primary-foreground' onClick={() => setMobileOpen(false)}>
                    <Heart className='inline mr-1' size={11} /> Favoritos
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileOpen(false) }}
                    className='block w-full text-left py-1 px-2 text-xs hover:bg-primary hover:text-primary-foreground'
                  >
                    Cerrar sesión
                  </button>
                </>
                )
              : (
                <>
                  <Link href='/login' className='block py-1 px-2 text-xs hover:bg-primary hover:text-primary-foreground' onClick={() => setMobileOpen(false)}>Iniciar sesión</Link>
                  <Link href='/register' className='block py-1 px-2 text-xs hover:bg-primary hover:text-primary-foreground' onClick={() => setMobileOpen(false)}>Registrarse</Link>
                </>
                )}

            <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid #ffffff', margin: '4px 0' }} />
            <div className='flex justify-between items-center px-2 py-1'>
              <span className='text-xs'>Tema</span>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
