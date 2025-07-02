'use client';

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SongList } from "@/components/song-list";
import type { Song } from "@/lib/types";
import { useI18n } from "@/context/i18n-context";
import { FeatureTour } from "./feature-tour";

export function HomeClient({ initialSongs }: { initialSongs: Song[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useI18n();

  const filteredSongs = useMemo(() => {
    if (!searchTerm) {
      return initialSongs;
    }
    return initialSongs.filter(song =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, initialSongs]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-foreground">{t('allSongs')}</h2>
        </div>
        <SongList songs={filteredSongs} />
      </main>
      <Footer />
      <FeatureTour />
    </div>
  );
}
