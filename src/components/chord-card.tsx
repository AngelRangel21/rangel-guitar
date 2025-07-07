"use client";

import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChordDiagrams } from "@/components/chord-diagrams";

/**
 * Componente que muestra una tarjeta para un acorde específico.
 * Al hacer clic, abre un popover que muestra los diagramas del acorde
 * para guitarra y teclado.
 * @param {{ chordName: string }} props - El nombre del acorde a mostrar.
 * @returns {JSX.Element} La tarjeta del acorde.
 */
export function ChordCard({ chordName }: { chordName: string }) {
  return (
    // Popover es el contenedor principal para la funcionalidad de ventana emergente.
    <Popover>
      {/* PopoverTrigger es el elemento que, al ser clickeado, abre el popover. */}
      <PopoverTrigger asChild>
        <Card className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-transparent bg-card w-full h-24 cursor-pointer flex flex-col items-center justify-center hover:border-accent">
          <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors">{chordName}</h3>
        </Card>
      </PopoverTrigger>
      {/* PopoverContent es el contenido que se muestra dentro de la ventana emergente. */}
      <PopoverContent className="w-80">
        {/* Componente que renderiza los diagramas de guitarra y teclado. */}
        <ChordDiagrams chordName={chordName} />
      </PopoverContent>
    </Popover>
  );
}
