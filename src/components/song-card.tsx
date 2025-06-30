import type { Song } from "@/lib/types";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Music2 } from "lucide-react";

interface SongCardProps {
  song: Song;
}

export function SongCard({ song }: SongCardProps) {
  const snippet = (song.chords || song.lyrics || "")
    .split('\n')
    .filter(line => line.trim() !== '') // remove empty lines
    .slice(0, 4) // take first 4 non-empty lines
    .join('\n');

  return (
    <Link href={`/songs/${song.id}`} className="group h-full" aria-label={`Ver canción ${song.title} de ${song.artist}`}>
      <Card className="h-full flex flex-col p-4 transition-all duration-300 hover:shadow-xl hover:border-accent bg-card">
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="flex-grow">
              <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{song.title}</h3>
              <p className="text-sm text-muted-foreground">{song.artist}</p>
          </div>
          <Music2 className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1 group-hover:text-accent transition-colors" />
        </div>
        <div className="flex-grow text-xs text-muted-foreground font-mono whitespace-pre-wrap break-words h-24 overflow-hidden bg-background/50 rounded-md p-2 border">
            {snippet || "No hay vista previa disponible."}
        </div>
      </Card>
    </Link>
  );
}
