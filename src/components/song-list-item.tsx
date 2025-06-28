import Image from "next/image";
import Link from "next/link";
import type { Song } from "@/lib/types";
import { ChevronRight } from "lucide-react";

export function SongListItem({ song }: { song: Song }) {
  return (
    <Link href={`/songs/${song.id}`} className="block transition-colors duration-200 rounded-lg hover:bg-secondary/80 group" aria-label={`Ver canción ${song.title} de ${song.artist}`}>
      <div className="flex items-center gap-4 p-2 ">
        <div className="flex-grow">
          <p className="font-semibold text-foreground">{song.title}</p>
          <p className="text-sm text-muted-foreground">{song.artist}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
