'use client'

import { useRouter } from 'next/navigation'
import type React from 'react'
import { type JSX, useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
// import { useI18n } from '@/context/i18n-context'
import { Spinner } from './ui/spinner'

interface ProtectedPageProps {
  children: React.ReactNode
  adminOnly?: boolean
  redirectTo?: string
}

export function ProtectedPage({
  children,
  adminOnly = false,
  redirectTo = '/login'
}: ProtectedPageProps): JSX.Element | null {
  const { isLoaded, isAuthenticated = false, isAdmin = false } = useAuth()
  const router = useRouter()
  // const { t } = useI18n()
  const [showLoading, setShowLoading] = useState<boolean>(false)

  const hasAccess = isAuthenticated && (!adminOnly || isAdmin)
  // const shouldRedirect = !hasAccess && isLoaded

  // Mostrar loading solo después de un pequeño delay para evitar flashes
  useEffect(() => {
    if (!isLoaded) {
      const timer = setTimeout(() => setShowLoading(true), 150)
      return () => clearTimeout(timer)
    }
  }, [isLoaded])

  // Manejar redirecciones
  useEffect(() => {
    if (isLoaded && !hasAccess) {
      const destination = !isAuthenticated ? redirectTo : '/'
      router.replace(destination)
    }
  }, [isLoaded, hasAccess, isAuthenticated, redirectTo, router])

  // Estado 1: No ha cargado aún, no mostrar nada (evitar flashes)
  if (!isLoaded && !showLoading) {
    return null
  }

  // Si está redirigiendo, no mostrar nada o mostrar mensaje de redirección
  // Estado 2: Cargando (con delay pasado)
  if (!isLoaded) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='flex flex-col items-center gap-2'>
          <Spinner />
          <p className='text-sm text-muted-foreground'>Redirigiendo</p>
        </div>
      </div>
    )
  }

  // Pantalla de carga minimalista
  // Estado 3: Cargó pero no tiene acceso (redirigiendo)
  if (!hasAccess) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='flex flex-col items-center gap-2'>
          <Spinner />
          <p className='text-sm text-muted-foreground'>Cargando</p>
        </div>
      </div>
    )
  }

  // Estado 4: Cargó y tiene acceso, mostrar contenido
  return <>{children}</>
}
