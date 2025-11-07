import Link from "next/link";
import type { Song } from "@/lib/types";
import { ChevronRight } from "lucide-react";

/**
 * Componente que muestra un elemento de canción en formato de lista.
 * @param {{ song: Song }} props - Propiedades del componente, contiene los datos de la canción.
 * @returns {JSX.Element} El elemento de la lista de canciones.
 */
export function SongListItem({ song }: { song: Song }) {
  return (
    <Link
      href={`/songs/${song.slug}`}
      className="block transition-colors duration-200 rounded-lg hover:bg-secondary/80 group"
      aria-label={`Ver canción ${song.title} de ${song.artist}`}
      title={`Canción ${song.title} de ${song.artist}`}
    >
      <section className="flex items-center gap-4 p-2 ">
        <picture className="bg-card p-2 rounded-lg">
          <img
            src={`${song.coverArt}`}
            alt={`Portada de la cancion ${song.title} del artista ${song.artist}`}
            className="h-12 w-20"
            title={`Portada de la cancion ${song.title} del artista ${song.artist}`}
          />
        </picture>

        <div className="flex-grow">
          <p className="font-semibold text-black dark:text-white">
            {song.title} - <span className="text-sm text">{song.artist}</span>
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </section>
    </Link>
  );
}
