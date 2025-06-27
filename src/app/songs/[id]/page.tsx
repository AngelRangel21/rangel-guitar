import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { mockSongs } from "@/lib/data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SongDisplay } from "@/components/song-display";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const song = mockSongs.find(s => s.id === parseInt(params.id));

  if (!song) {
    return {
      title: "Song Not Found",
    }
  }

  return {
    title: `${song.title} by ${song.artist} | Rangel Guitar Hub`,
    description: `Learn to play ${song.title} on guitar with chords and lyrics.`,
  }
}

export default function SongPage({ params }: { params: { id: string } }) {
  const song = mockSongs.find(s => s.id === parseInt(params.id));

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
