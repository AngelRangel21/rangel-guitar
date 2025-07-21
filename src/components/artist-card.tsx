import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import type { Song } from "@/lib/types";

/**
 * Componente que muestra una tarjeta individual para un artista.
 * Al hacer clic, navega a la página de detalle de ese artista.
 * @param {{ artistName: string }} props - Propiedades del componente, contiene el nombre del artista.
 * @returns {JSX.Element} La tarjeta del artista.
 */
export function ArtistCard({ artistName }: { artistName: string }) {
  return (
    // Enlace que envuelve toda la tarjeta para la navegación.
    <Link href={`/artists/${encodeURIComponent(artistName)}`} aria-label={`Ver canciones de ${artistName}`}>
      <Card className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-transparent bg-card w-full h-full cursor-pointer flex flex-col">
        <div className="relative">
          {/* Imagen del artista. */}
          <Image
            src={`https://placehold.co/400x400.png`}
            alt={`Foto de ${artistName}`}
            width={400}
            height={400}
            className="aspect-square object-cover w-full transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="musician portrait"
          />
           {/* Superposición con icono que aparece al pasar el ratón. */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <User className="h-12 w-12 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0" />
          </div>
        </div>
        <div className="p-3 flex-grow flex items-center justify-center">
          {/* Nombre del artista. */}
          <h3 className="font-semibold text-foreground truncate w-full">{artistName}</h3>
        </div>
      </Card>
    </Link>
  );
}
