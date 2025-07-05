import Link from "next/link";
import type { Song } from "@/lib/types";
import { useI18n } from "@/context/i18n-context";
import { Eye, Heart } from "lucide-react";

interface TopSongListItemProps {
    song: Song;
    rank: number;
    type: 'visits' | 'likes';
}

export function TopSongListItem({ song, rank, type }: TopSongListItemProps) {
  const { t } = useI18n();

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
