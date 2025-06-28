import Image from "next/image";
import type { Song } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { PlayCircle } from "lucide-react";
import Link from "next/link";

interface SongCardProps {
  song: Song;
}

export function SongCard({ song }: SongCardProps) {
  return (
    <Link href={`/songs/${song.id}`} className="group" aria-label={`Ver canción ${song.title} de ${song.artist}`}>
      <Card className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-transparent bg-card w-full h-full cursor-pointer flex flex-col">
        <div className="relative">
          <Image
            src={song.coverArt}
            alt={`Portada de ${song.title}`}
            width={400}
            height={400}
            className="aspect-square object-cover w-full transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="guitar music"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <PlayCircle className="h-12 w-12 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0" />
          </div>
        </div>
        <div className="p-3 flex-grow">
          <h3 className="font-semibold text-foreground truncate w-full">{song.title}</h3>
          <p className="text-sm text-muted-foreground truncate w-full">{song.artist}</p>
        </div>
      </Card>
    </Link>
  );
}
