import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ArtistList } from "@/components/artist-list";
import { songs } from "@/lib/data";

export default function ArtistsPage() {
  const artists = Array.from(new Set(songs.map(song => song.artist)));

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ArtistList artists={artists} />
      </main>
      <Footer />
    </div>
  );
}
