import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { songs } from "@/lib/data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SongDisplay } from "@/components/song-display";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const song = songs.find(s => s.id === parseInt(params.id));

  if (!song) {
    return {
      title: "Canción no encontrada",
    }
  }

  const description = `Aprende a tocar ${song.title} de ${song.artist} en guitarra. Letra, acordes y video tutorial disponibles en Rangel Guitar.`;

  return {
    title: `${song.title} - ${song.artist}`,
    description: description,
    openGraph: {
        title: `${song.title} - ${song.artist}`,
        description: description,
        type: 'music.song',
        images: [
            {
                url: song.coverArt,
                width: 400,
                height: 400,
                alt: `Portada de ${song.title}`,
            }
        ],
    },
  }
}

export default function SongPage({ params }: { params: { id: string } }) {
  const song = songs.find(s => s.id === parseInt(params.id));

  if (!song) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <SongDisplay song={song} />
      </main>
      <Footer />
    </div>
  );
}
