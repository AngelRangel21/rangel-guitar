import { ProtectedPage } from '@/components/protected-page'
import { UploadArtistForm } from '@/components/upload-artist-form'

export default function Page() {
  return (
    <ProtectedPage adminOnly>
      <div className='flex flex-col min-h-screen bg-background'>
        <main className='grow container mx-auto px-4 py-8 flex justify-center'>
          <UploadArtistForm />
        </main>
      </div>
    </ProtectedPage>
  )
}
