import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { songs } from "@/lib/data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SongDisplay } from "@/components/song-display";
import type { Song } from "@/lib/types";

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

  // --- Suggestion Logic ---
  const MAX_SUGGESTIONS = 4;

  // 1. Get other songs by the same artist
  let suggestedSongs: Song[] = songs.filter(
    s => s.artist === song.artist && s.id !== song.id
  );

  // 2. If not enough, get random songs from other artists
  if (suggestedSongs.length < MAX_SUGGESTIONS) {
      const otherSongs = songs.filter(
          s => s.artist !== song.artist && s.id !== song.id
      );
      
      const remainingNeeded = MAX_SUGGESTIONS - suggestedSongs.length;
      
      // Shuffle otherSongs to get random ones
      const shuffledOtherSongs = otherSongs.sort(() => 0.5 - Math.random());

      suggestedSongs.push(...shuffledOtherSongs.slice(0, remainingNeeded));
  }
  
  // 3. Ensure we don't exceed the max number of suggestions
  suggestedSongs = suggestedSongs.slice(0, MAX_SUGGESTIONS);
  // --- End Suggestion Logic ---


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <SongDisplay song={song} suggestedSongs={suggestedSongs} />
      </main>
      <Footer />
    </div>
  );
}
