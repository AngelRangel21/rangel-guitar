'use client';

import type { Song } from "@/lib/types";
import { useI18n } from "@/context/i18n-context";
import { SongList } from "@/components/song-list";

/**
 * Propiedades que el componente ArtistDetailContent espera recibir.
 */
interface ArtistDetailContentProps {
    artistName: string;
    songs: Song[];
}

/**
 * Componente que muestra el contenido de la página de detalle de un artista.
 * Renderiza el título con el nombre del artista y la lista de sus canciones.
 * Es un Client Component para poder usar el hook de internacionalización (useI18n).
 * @param {ArtistDetailContentProps} props - Propiedades del componente.
 * @returns {JSX.Element} El contenido principal de la página de detalle del artista.
 */
export function ArtistDetailContent({ artistName, songs }: ArtistDetailContentProps) {
  const { t } = useI18n(); // Hook para obtener las traducciones.

  return (
    <main className="flex-grow container mx-auto px-4 py-8 space-y-6 opacity-0 animate-content-in">
      <h1 className="text-4xl font-bold">{t('songsBy', { artist: artistName })}</h1>
      {/* Componente que renderiza la lista de canciones. */}
      <SongList songs={songs} />
    </main>
  );
}
