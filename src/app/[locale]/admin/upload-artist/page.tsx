import { AdminShell } from '@/components/admin/admin-shell'
import { ProtectedPage } from '@/components/protected-page'
import { UploadArtistForm } from '@/components/upload-artist-form'

export default function Page() {
  return (
    <ProtectedPage adminOnly>
      <AdminShell>
        <UploadArtistForm />
      </AdminShell>
    </ProtectedPage>
  )
}
