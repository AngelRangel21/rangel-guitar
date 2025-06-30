
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
    // No timer needed now as AuthProvider handles loading state
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const favoriteSongs = songs.filter(song => favorites.includes(song.id));

  // The AuthProvider now shows a loading screen, so we can assume isAuthenticated is stable here.
  // If still not authenticated, it means the user should not be here.
  if (!isAuthenticated) {
    return null; // Or a redirect could happen here too, but useEffect handles it.
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
