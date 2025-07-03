import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ArtistList } from "@/components/artist-list";
import { getArtists } from "@/services/songs-service";

export default async function ArtistsPage() {
  const artists = await getArtists();

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
