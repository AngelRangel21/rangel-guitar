"use client";

import { transposeChord } from "@/lib/music";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChordDiagrams } from "@/components/chord-diagrams";

export function Chord({ name, transpose = 0 }: { name: string, transpose?: number }) {
  const transposedChord = transposeChord(name, transpose);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="font-bold text-accent cursor-pointer hover:underline">
          {transposedChord}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <ChordDiagrams chordName={transposedChord} />
      </PopoverContent>
    </Popover>
  );
}
