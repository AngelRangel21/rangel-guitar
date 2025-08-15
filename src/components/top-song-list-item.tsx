import Link from "next/link";
import type { Song } from "@/lib/types";
import { Eye, Heart } from "lucide-react";

/**
 * Propiedades que el componente TopSongListItem espera recibir.
 */
interface TopSongListItemProps {
    song: Song;
    rank: number;
    type: 'visits' | 'likes';
}

/**
 * Componente que muestra un elemento de canción en las listas de "Top Canciones".
 * Muestra el rango, el título, el artista y el recuento de visitas o "me gusta".
 * @param {TopSongListItemProps} props - Propiedades del componente.
 * @returns {JSX.Element} El elemento de la lista de top canciones.
 */
export function TopSongListItem({ song, rank, type }: TopSongListItemProps) {

  // Determina el recuento y el icono a mostrar según el tipo ('visits' o 'likes').
  const count = type === 'visits' ? song.visitCount : song.likeCount;
  const Icon = type === 'visits' ? Eye : Heart;
  
  return (
    <Link href={`/songs/${song.slug}`} className="flex items-center gap-4 p-3 transition-colors rounded-md hover:bg-secondary/50 group">
        <div className="flex items-center justify-center w-6 font-bold text-xl text-muted-foreground group-hover:text-accent transition-colors">{rank}</div>
        <div className="flex-grow">
          <p className="font-semibold text-foreground group-hover:text-accent transition-colors">{song.title}</p>
          <p className="text-sm text-muted-foreground">{song.artist}</p>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground tabular-nums">
            <Icon className="h-4 w-4"/>
            <span>{count.toLocaleString()}</span>
        </div>
    </Link>
  );
}
