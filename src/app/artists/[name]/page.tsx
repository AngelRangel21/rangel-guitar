import type { Metadata } from 'next';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getSongsByArtist, getArtists } from "@/services/songs-service";
import { notFound } from "next/navigation";
import { ArtistDetailContent } from '@/components/artist-detail-content';

export async function generateStaticParams() {
    const artists = await getArtists();
    return artists.map(name => ({ name: encodeURIComponent(name) }));
}

export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
    const artistName = decodeURIComponent(params.name);
    const artistSongs = await getSongsByArtist(artistName);

    if (artistSongs.length === 0) {
        return {
            title: 'Artista no encontrado'
        }
    }

    const description = `Explora todas las canciones y tablaturas de ${artistName} en Rangel Guitar. Aprende a tocar sus éxitos en guitarra.`;

    return {
        title: `Canciones de ${artistName}`,
        description: description,
        openGraph: {
            title: `Canciones de ${artistName}`,
            description: description,
        },
    }
}


export default async function ArtistDetailPage({ params }: { params: { name: string } }) {
  const artistName = decodeURIComponent(params.name);
  const artistSongs = await getSongsByArtist(artistName);

  if (artistSongs.length === 0) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <ArtistDetailContent artistName={artistName} songs={artistSongs} />
      <Footer />
    </div>
  );
}
