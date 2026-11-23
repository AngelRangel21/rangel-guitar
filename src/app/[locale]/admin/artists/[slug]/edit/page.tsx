import { notFound } from 'next/navigation'
import { AdminShell } from '@/components/admin/admin-shell'
import { EditArtistForm } from '@/components/edit-artist-form'
import { ProtectedPage } from '@/components/protected-page'
import { getArtistBySlug } from '@/services/artists.service'

export default async function EditArtistPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const artist = await getArtistBySlug(slug)

  if (artist == null) {
    notFound()
  }

  return (
    <ProtectedPage adminOnly>
      <AdminShell>
        <EditArtistForm artist={artist} />
      </AdminShell>
    </ProtectedPage>
  )
}
