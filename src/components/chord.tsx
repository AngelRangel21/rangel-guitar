"use client";

import { transposeChord } from "@/lib/music";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChordDiagrams } from "@/components/chord-diagrams";

/**
 * Componente que representa un único acorde en la hoja de acordes.
 * Es clickeable y muestra un popover con los diagramas del acorde.
 * También maneja la transposición del acorde.
 * @param {{ name: string, transpose?: number }} props - El nombre del acorde y el valor de transposición.
 * @returns {JSX.Element} El componente del acorde.
 */
export function Chord({ name, transpose = 0 }: { name: string, transpose?: number }) {
  // Calcula el acorde transpuesto utilizando la función de la librería de música.
  const transposedChord = transposeChord(name, transpose);

  return (
    // Popover que se abre al hacer clic en el acorde.
    <Popover>
      <PopoverTrigger asChild>
        {/* El nombre del acorde transpuesto se muestra en la hoja de acordes. */}
        <span className="font-bold text-accent cursor-pointer hover:underline">
          {transposedChord}
        </span>
      </PopoverTrigger>
      {/* Contenido del popover, que muestra los diagramas del acorde transpuesto. */}
      <PopoverContent className="w-80">
        <ChordDiagrams chordName={transposedChord} />
      </PopoverContent>
    </Popover>
  );
}
