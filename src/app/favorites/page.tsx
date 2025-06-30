
'use client';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SongList } from "@/components/song-list";
import { useAuth } from "@/context/auth-context";
import { songs } from "@/lib/data";
import { useI18n } from "@/context/i18n-context";
import { Heart } from "lucide-react";
import { ProtectedPage } from "@/components/protected-page";

export default function FavoritesPage() {
  const { favorites } = useAuth();
  const { t } = useI18n();

  const favoriteSongs = songs.filter(song => favorites.includes(song.id));

  return (
    <ProtectedPage>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 space-y-6">
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
        </main>
        <Footer />
      </div>
    </ProtectedPage>
  );
}
