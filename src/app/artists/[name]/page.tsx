import type { Metadata } from 'next';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getSongsByArtist, getArtists, getArtistByName } from "@/services/songs-service";
import { notFound } from "next/navigation";
import { ArtistDetailContent } from '@/components/artist-detail-content';

/**
 * Genera los parámetros estáticos para todas las páginas de artistas en tiempo de compilación.
 * Esto permite a Next.js pre-renderizar cada página de artista, mejorando el rendimiento.
 * @returns {Promise<{ name: string }[]>} Un array de objetos con los nombres de los artistas codificados para la URL.
 */
export async function generateStaticParams() {
    const artists = await getArtists();
    return artists.map(artist => ({ name: encodeURIComponent(artist.name) }));
}

/**
 * Genera los metadatos (título, descripción, etc.) para la página de un artista específico.
 * Es crucial para el SEO y para cómo se muestra la página al compartirla en redes sociales.
 * @param {{ params: { name: string } }} props - Las propiedades de la página, incluyendo el nombre del artista desde la URL.
 * @returns {Promise<Metadata>} El objeto de metadatos para la página.
 */
export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
    const artistName = decodeURIComponent(params.name);
    const artist = await getArtistByName(artistName);

    // Si no se encuentra el artista, se establece un título genérico.
    if (!artist) {
        return {
            title: 'Artista no encontrado'
        }
    }

    const description = `Explora todas las canciones y tablaturas de ${artistName} en Rangel Guitar. Aprende a tocar sus éxitos en guitarra.`;
    const title = `Canciones de ${artistName}`;

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            type: 'website',
            images: [
              {
                url: artist.imageUrl || 'https://placehold.co/1200x630.png',
                width: 1200,
                height: 630,
                alt: `Canciones de ${artistName} en Rangel Guitar`,
              },
            ],
        },
    }
}

/**
 * Página que muestra todas las canciones de un artista específico.
 * Es una página renderizada en el servidor (Server Component) que obtiene los datos en tiempo de compilación.
 * @param {{ params: { name: string } }} props - Las propiedades de la página, incluyendo el nombre del artista.
 * @returns {Promise<JSX.Element>} La página de detalle del artista.
 */
export default async function ArtistDetailPage({ params }: { params: { name: string } }) {
  // Decodifica el nombre del artista desde la URL (ej. "Guns%20N'%20Roses" -> "Guns N' Roses").
  const artistName = decodeURIComponent(params.name);
  // Obtiene todas las canciones del artista desde el servicio.
  const artistSongs = await getSongsByArtist(artistName);

  // Si no se encuentran canciones, muestra la página de error 404.
  // Esto puede ocurrir si un artista existe pero no tiene canciones asociadas todavía.
  const artistExists = await getArtistByName(artistName);
  if (!artistExists) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      {/* El contenido principal se delega a un Client Component para permitir interactividad y hooks. */}
      <ArtistDetailContent artistName={artistName} songs={artistSongs} />
      <Footer />
    </div>
  );
}
