import type { Song } from "@/lib/types";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Music2 } from "lucide-react";

/**
 * Propiedades que el componente SongCard espera recibir.
 */
interface SongCardProps {
  song: Song;
}

/**
 * Componente que muestra una tarjeta individual para una canción en la vista de cuadrícula.
 * @param {SongCardProps} props - Propiedades del componente, contiene los datos de la canción.
 * @returns {JSX.Element} La tarjeta de la canción.
 */
export function SongCard({ song }: SongCardProps) {
  // Genera un pequeño fragmento (snippet) de la letra o acordes para la vista previa.
  const snippet = (song.chords || song.lyrics || "")
    .split('\n')
    .filter(line => line.trim() !== '') // Elimina líneas vacías.
    .slice(0, 4) // Toma las primeras 4 líneas no vacías.
    .join('\n');

  return (
    <Link href={`/songs/${song.slug}`} className="group h-full" aria-label={`Ver canción ${song.title} de ${song.artist}`}>
      <Card className="h-full flex flex-col p-4 transition-all duration-300 hover:shadow-xl hover:border-accent bg-card">
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="flex-grow">
              <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{song.title}</h3>
              <p className="text-sm text-muted-foreground">{song.artist}</p>
          </div>
          <Music2 className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1 group-hover:text-accent transition-colors" />
        </div>
        {/* Muestra el fragmento de la letra/acordes. */}
        <div className="flex-grow text-xs text-muted-foreground font-mono whitespace-pre-wrap break-words h-24 overflow-hidden bg-background/50 rounded-md p-2 border">
            {snippet || "No hay vista previa disponible."}
        </div>
      </Card>
    </Link>
  );
}
