'use client';

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SongList } from "@/components/song-list";
import { mockSongs } from "@/lib/data";
import type { Song } from "@/lib/types";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSongs = useMemo(() => {
    if (!searchTerm) {
      return mockSongs;
    }
    return mockSongs.filter(song =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <SongList songs={filteredSongs} />
      </main>
      <Footer />
    </div>
  );
}
