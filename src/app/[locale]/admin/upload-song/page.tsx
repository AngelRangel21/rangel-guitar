import type { JSX } from 'react'
import { AdminShell } from '@/components/admin/admin-shell'
import { ProtectedPage } from '@/components/protected-page'
import { UploadSongForm } from '@/components/upload-song-form'

/**
 * Página que permite a los administradores subir una nueva canción directamente a la biblioteca.
 * Esta página está protegida y solo es accesible para administradores.
 * @returns {JSX.Element} La página con el formulario para subir canciones.
 */
export default function UploadSongPage(): JSX.Element {
  return (
    // Componente que protege la página, requiriendo autenticación de administrador.
    <ProtectedPage adminOnly>
      <AdminShell>
        {/* El formulario para subir la nueva canción. */}
        <UploadSongForm />
      </AdminShell>
    </ProtectedPage>
  )
}
