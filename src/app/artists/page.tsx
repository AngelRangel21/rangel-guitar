import { ArtistList } from '@/components/artist-list'
import { getArtists } from '@/services/artists.service'
import { JSX } from 'react'

export default async function ArtistsPage (): Promise<JSX.Element> {
  // Obtiene la lista completa de artistas desde el servicio.
  const artists = await getArtists()

  return (
    <div className='flex flex-col min-h-screen bg-background'>
      <main className='grow container mx-auto px-4 py-8 opacity-0 animate-content-in'>
        {/* El componente ArtistList se encarga de renderizar la cuadrícula de artistas. */}
        <ArtistList artists={artists} />
      </main>
    </div>
  )
}
