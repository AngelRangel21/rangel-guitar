import { type JSX, Suspense } from 'react'
import { AdminShell } from '@/components/admin/admin-shell'
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
      <AdminShell>
        <Suspense fallback={<ArtistsLoader />}>
          <ArtistsContent locale={locale} />
        </Suspense>
      </AdminShell>
    </ProtectedPage>
  )
}
