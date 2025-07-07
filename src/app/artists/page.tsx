import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ArtistList } from "@/components/artist-list";
import { getArtists } from "@/services/songs-service";

/**
 * Página que muestra una lista de todos los artistas disponibles en la biblioteca.
 * Es un Server Component que obtiene la lista de artistas en tiempo de compilación.
 * @returns {Promise<JSX.Element>} La página con la lista de todos los artistas.
 */
export default async function ArtistsPage() {
  // Obtiene la lista completa de artistas desde el servicio.
  const artists = await getArtists();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 opacity-0 animate-content-in">
        {/* El componente ArtistList se encarga de renderizar la cuadrícula de artistas. */}
        <ArtistList artists={artists} />
      </main>
      <Footer />
    </div>
  );
}
