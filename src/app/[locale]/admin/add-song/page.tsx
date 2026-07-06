'use client'

import { useSearchParams } from 'next/navigation'
import { type JSX, Suspense } from 'react'
import { AddSongForm } from '@/components/add-song-form'
import { ProtectedPage } from '@/components/protected-page'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Componente interno que lee los parámetros de la URL para pre-rellenar el formulario.
 * Se utiliza dentro de un <Suspense> para evitar que toda la página espere por los parámetros.
 * @returns {JSX.Element} El formulario para agregar una canción o un mensaje de error.
 */
function AddSongContent(): JSX.Element {
  // Hook para acceder a los parámetros de la URL (ej: ?id=123&title=...).
  const searchParams = useSearchParams()

  // Obtiene los datos de la solicitud de la URL.
  const requestId = searchParams.get('id')
  const title = searchParams.get('title')
  const artist = searchParams.get('artist')

  // Si falta algún dato esencial, muestra un mensaje de error.
  if (requestId == null || title == null || artist == null) {
    return (
      <Card className='w-full max-w-2xl'>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Información de la solicitud inválida o faltante. Por favor, vuelva a
            la lista de solicitudes e inténtelo de nuevo.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Renderiza el formulario con los datos iniciales de la solicitud.
  return (
    <AddSongForm
      requestId={requestId}
      initialTitle={title}
      initialArtist={artist}
    />
  )
}

/**
 * Componente de carga que muestra una estructura "esqueleto" (skeleton)
 * mientras el contenido principal se está cargando.
 * @returns {JSX.Element} La interfaz de esqueleto del formulario.
 */
function AddSongLoader(): JSX.Element {
  return (
    <Card className='w-full max-w-2xl'>
      <CardHeader>
        <Skeleton className='h-8 w-1/2' />
        <Skeleton className='h-4 w-3/4 mt-2' />
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-1/4' />
              <Skeleton className='h-10 w-full' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-1/4' />
              <Skeleton className='h-10 w-full' />
            </div>
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-1/4' />
            <Skeleton className='h-24 w-full' />
          </div>
          <Skeleton className='h-10 w-full' />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Página principal para agregar una canción, generalmente a partir de una solicitud de usuario.
 * Esta página está protegida y solo es accesible para administradores.
 * Utiliza Suspense para mostrar un estado de carga mientras se obtienen los datos de la URL.
 * @returns {JSX.Element} La página completa para agregar una canción.
 */
export default function AddSongPage(): JSX.Element {
  return (
    // Componente que protege la página, requiriendo autenticación de administrador.
    <ProtectedPage adminOnly>
      <div className='flex flex-col min-h-screen bg-background'>
        <main className='grow container mx-auto px-4 py-8 flex justify-center'>
          {/* Suspense muestra el `fallback` (AddSongLoader) mientras AddSongContent espera los datos. */}
          <Suspense fallback={<AddSongLoader />}>
            <AddSongContent />
          </Suspense>
        </main>
      </div>
    </ProtectedPage>
  )
}
