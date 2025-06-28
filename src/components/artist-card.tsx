import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

export function ArtistCard({ artist }: { artist: string }) {
  return (
    <Link href={`/artists/${encodeURIComponent(artist)}`}>
      <Card className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-transparent bg-card w-full cursor-pointer text-center">
        <div className="relative">
          <Image
            src={`https://placehold.co/400x400.png`}
            alt={`Photo of ${artist}`}
            width={400}
            height={400}
            className="aspect-square object-cover w-full transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="musician portrait"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <User className="h-12 w-12 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0" />
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-foreground truncate w-full">{artist}</h3>
        </div>
      </Card>
    </Link>
  );
}
