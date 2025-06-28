'use client';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SongList } from "@/components/song-list";
import { songs } from "@/lib/data";
import { useI18n } from "@/context/i18n-context";
import { notFound } from "next/navigation";

export default function ArtistDetailPage({ params }: { params: { name: string } }) {
  const artistName = decodeURIComponent(params.name);
  const artistSongs = songs.filter(song => song.artist === artistName);
  const { t } = useI18n();

  if (artistSongs.length === 0) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-4xl font-bold">{t('songsBy', { artist: artistName })}</h1>
        <SongList songs={artistSongs} />
      </main>
      <Footer />
    </div>
  );
}
