"use client";

import { ArtistCard } from "@/components/artist-card";
import { useI18n } from "@/context/i18n-context";

export function ArtistList({ artists }: { artists: string[] }) {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">{t('allArtists')}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {artists.map((artist, index) => (
          <div key={artist} style={{ animationDelay: `${index * 50}ms` }} className="opacity-0 animate-content-in">
            <ArtistCard artist={artist} />
          </div>
        ))}
      </div>
    </div>
  );
}
