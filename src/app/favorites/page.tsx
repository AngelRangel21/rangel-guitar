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

/**
 * Componente que muestra el contenido de la página de favoritos.
 * Se encarga de obtener las canciones favoritas del usuario y mostrarlas.
 * @returns {JSX.Element} El contenido de la página de favoritos.
 */
function FavoritesContent() {
  // Hooks para el estado de autenticación, internacionalización y datos locales.
  const { favorites, isLoaded } = useAuth();
  const { t } = useI18n();
  const [favoriteSongs, setFavoriteSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect para cargar las canciones favoritas cuando el estado de autenticación está listo.
  useEffect(() => {
    // Solo se ejecuta si el estado de autenticación ya se ha cargado.
    if (isLoaded) {
      setIsLoading(true);
      // Obtiene todas las canciones.
      getSongs().then(allSongs => {
        // Filtra las canciones para quedarse solo con las que están en la lista de favoritos del usuario.
        const favs = allSongs.filter(song => favorites.includes(song.id));
        setFavoriteSongs(favs);
        setIsLoading(false); // Termina la carga.
      });
    }
  }, [favorites, isLoaded]); // Se vuelve a ejecutar si la lista de favoritos o el estado de carga cambian.

  // Muestra un esqueleto de carga mientras se obtienen los datos.
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

  // Renderiza el contenido principal de la página.
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">{t('myFavorites')}</h1>
      </div>
      {/* Muestra la lista de canciones si hay favoritas, o un mensaje si no las hay. */}
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

/**
 * Página principal de "Favoritos".
 * Esta página está protegida y solo es accesible para usuarios autenticados.
 * @returns {JSX.Element} La página de favoritos.
 */
export default function FavoritesPage() {
  return (
    // Componente que protege la página, requiriendo autenticación.
    <ProtectedPage>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 space-y-6 opacity-0 animate-content-in">
            {/* El contenido se maneja en un componente separado. */}
            <FavoritesContent />
        </main>
        <Footer />
      </div>
    </ProtectedPage>
  );
}
