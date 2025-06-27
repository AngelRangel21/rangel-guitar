"use client";

import { useState } from "react";
import type { Song } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { ChordSheet } from "./chord-sheet";
import Image from "next/image";

export function SongDisplay({ song }: { song: Song }) {
  const [transpose, setTranspose] = useState(0);

  const getTransposedKeyText = () => {
    if (transpose === 0) return "Original Key";
    if (transpose > 0) return `+${transpose} semitones`;
    return `${transpose} semitones`;
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <Card className="overflow-hidden sticky top-24">
          <Image
            src={song.coverArt}
            alt={`Cover art for ${song.title}`}
            width={600}
            height={600}
            className="aspect-square object-cover w-full"
            data-ai-hint="guitar music"
          />
          <CardHeader>
            <CardTitle className="text-2xl">{song.title}</CardTitle>
            <CardDescription>{song.artist}</CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Transpose</h3>
            <div className="flex items-center justify-between gap-4">
              <Button variant="outline" size="icon" onClick={() => setTranspose(t => t - 1)}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold text-lg w-32 text-center">{getTransposedKeyText()}</span>
              <Button variant="outline" size="icon" onClick={() => setTranspose(t => t + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
             {transpose !== 0 && (
              <Button variant="ghost" size="sm" onClick={() => setTranspose(0)} className="w-full mt-4">
                Reset
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardContent className="p-6">
            <ChordSheet text={song.chords || ""} transpose={transpose} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
