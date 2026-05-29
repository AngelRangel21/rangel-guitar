import { notFound } from 'next/navigation'
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
      <div className='flex flex-col min-h-screen bg-background'>
        <main className='grow container mx-auto px-4 py-8 flex justify-center'>
          <EditArtistForm artist={artist} />
        </main>
      </div>
    </ProtectedPage>
  )
}
