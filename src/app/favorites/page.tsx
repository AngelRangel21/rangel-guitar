'use client';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SongList } from "@/components/song-list";
import { useAuth } from "@/context/auth-context";
import { getSongs } from "@/services/songs-service";
import { useI18n } from "@/context/i18n-context";
import { Heart } from "lucide-react";
import { ProtectedPage } from "@/components/protected-page";
import { useEffect, useState } from "react";
import type { Song } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

function FavoritesContent() {
  const { favorites, isLoaded } = useAuth();
  const { t } = useI18n();
  const [favoriteSongs, setFavoriteSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      setIsLoading(true);
      getSongs().then(allSongs => {
        const favs = allSongs.filter(song => favorites.includes(song.id));
        setFavoriteSongs(favs);
        setIsLoading(false);
      });
    }
  }, [favorites, isLoaded]);

  if (isLoading) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Skeleton className="h-9 w-48" />
            </div>
            <div className="flex flex-col space-y-3">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-6 opacity-0 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">{t('myFavorites')}</h1>
      </div>
      {favoriteSongs.length > 0 ? (
        <SongList songs={favoriteSongs} />
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">{t('noFavorites')}</p>
        </div>
      )}
    </div>
  )
}

export default function FavoritesPage() {
  return (
    <ProtectedPage>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 space-y-6">
            <FavoritesContent />
        </main>
        <Footer />
      </div>
    </ProtectedPage>
  );
}
