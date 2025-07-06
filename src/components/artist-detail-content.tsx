'use client';

import type { Song } from "@/lib/types";
import { useI18n } from "@/context/i18n-context";
import { SongList } from "@/components/song-list";

interface ArtistDetailContentProps {
    artistName: string;
    songs: Song[];
}

export function ArtistDetailContent({ artistName, songs }: ArtistDetailContentProps) {
  const { t } = useI18n();

  return (
    <main className="flex-grow container mx-auto px-4 py-8 space-y-6 opacity-0 animate-content-in">
      <h1 className="text-4xl font-bold">{t('songsBy', { artist: artistName })}</h1>
      <SongList songs={songs} />
    </main>
  );
}
