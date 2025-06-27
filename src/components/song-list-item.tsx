import Image from "next/image";
import type { Song } from "@/lib/types";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SongListItem({ song }: { song: Song }) {
  return (
    <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary/80 transition-colors duration-200 group cursor-pointer">
      <Image
        src={song.coverArt}
        alt={`Cover art for ${song.title}`}
        width={48}
        height={48}
        className="rounded-md aspect-square object-cover"
        data-ai-hint="guitar music"
      />
      <div className="flex-grow">
        <p className="font-semibold text-foreground">{song.title}</p>
        <p className="text-sm text-muted-foreground">{song.artist}</p>
      </div>
      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Play ${song.title}`}>
        <Play className="h-5 w-5 text-accent" />
      </Button>
    </div>
  );
}
