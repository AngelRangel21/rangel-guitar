"use client";

import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChordDiagrams } from "@/components/chord-diagrams";

export function ChordCard({ chordName }: { chordName: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Card className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-transparent bg-card w-full h-24 cursor-pointer flex flex-col items-center justify-center hover:border-accent">
          <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors">{chordName}</h3>
        </Card>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <ChordDiagrams chordName={chordName} />
      </PopoverContent>
    </Popover>
  );
}
