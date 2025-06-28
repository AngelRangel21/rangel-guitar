
'use client';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SongList } from "@/components/song-list";
import { useAuth } from "@/context/auth-context";
import { songs } from "@/lib/data";
import { useI18n } from "@/context/i18n-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const { isAuthenticated, favorites } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push('/login');
      }
    }, 100); // Small delay to allow auth context to initialize
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  const favoriteSongs = songs.filter(song => favorites.includes(song.id));

  if (!isAuthenticated) {
    // Render a loading state or null while checking for authentication
    return (
        <div className="flex flex-col min-h-screen bg-background">
          <Header />
            <main className="flex-grow flex items-center justify-center">
              <p>{t('loading')}...</p>
            </main>
          <Footer />
      </div>
    );
  }

  return (
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
  );
}
