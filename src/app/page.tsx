import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SongList } from "@/components/song-list";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <SongList />
      </main>
      <Footer />
    </div>
  );
}
