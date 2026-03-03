'use client'

import { RequestSongForm } from '@/components/request-song-form'
import { ProtectedPage } from '@/components/protected-page'
import { JSX } from 'react'

/**
 * Página que permite a los usuarios autenticados solicitar nuevas canciones.
 * La página está protegida y redirige a la página de inicio de sesión si el usuario no está autenticado.
 * @returns {JSX.Element} La página de solicitud de canciones.
 */
export default function RequestSongPage (): JSX.Element {
  return (
    // Componente que protege la página, requiriendo que el usuario esté autenticado.
    <ProtectedPage>
      <div className='flex flex-col min-h-screen bg-background'>
        <main className='grow flex items-center justify-center container mx-auto px-4 py-8'>
          {/* Componente que contiene la lógica y la interfaz del formulario de solicitud. */}
          <RequestSongForm />
        </main>
      </div>
    </ProtectedPage>
  )
}
