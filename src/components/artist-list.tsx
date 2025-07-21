"use client";

import { ArtistCard } from "@/components/artist-card";
import { useI18n } from "@/context/i18n-context";
import type { Artist } from "@/lib/types";

/**
 * Componente que muestra una cuadrícula de todos los artistas.
 * Es un Client Component para poder usar el hook de internacionalización (useI18n).
 * @param {{ artists: Artist[] }} props - Propiedades del componente, contiene la lista de objetos de artistas.
 * @returns {JSX.Element} La lista de artistas en una cuadrícula.
 */
export function ArtistList({ artists }: { artists: Artist[] }) {
  const { t } = useI18n(); // Hook para obtener las traducciones.

  // Ordena los artistas alfabéticamente en el cliente
  const sortedArtists = [...artists].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">{t('allArtists')}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {/* Itera sobre la lista de artistas y renderiza una tarjeta para cada uno. */}
        {sortedArtists.map((artist, index) => (
          // La animación se retrasa ligeramente para cada tarjeta, creando un efecto de cascada.
          <div key={artist.id} style={{ animationDelay: `${index * 50}ms` }} className="opacity-0 animate-content-in">
            <ArtistCard artist={artist} />
          </div>
        ))}
      </div>
    </div>
  );
}
