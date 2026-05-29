import { type JSX, Suspense } from 'react'
import { ArtistsContent } from '@/components/admin/artists/artist-content'
import { ArtistsLoader } from '@/components/admin/artists/artists-loader'
import { ProtectedPage } from '@/components/protected-page'

export default async function ArtistsPage({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<JSX.Element> {
  const { locale } = await params

  return (
    <ProtectedPage adminOnly>
      <div className='flex flex-col min-h-screen bg-background'>
        <main className='grow container mx-auto px-4 py-8'>
          <Suspense fallback={<ArtistsLoader />}>
            <ArtistsContent locale={locale} />
          </Suspense>
        </main>
      </div>
    </ProtectedPage>
  )
}
