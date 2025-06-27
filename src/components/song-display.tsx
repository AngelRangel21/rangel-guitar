"use client";

import { useState } from "react";
import type { Song } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChordSheet } from "./chord-sheet";
import { Minus, Plus, Facebook, Twitter } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import Image from "next/image";

export function SongDisplay({ song }: { song: Song }) {
  const [transpose, setTranspose] = useState(0);

  const getTransposedKeyText = () => {
    if (transpose === 0) return "Original Key";
    if (transpose > 0) return `+${transpose} semitones`;
    return `${transpose} semitones`;
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card className="overflow-hidden lg:sticky lg:top-24">
          <Image
            src={song.coverArt}
            alt={`Cover art for ${song.title}`}
            width={600}
            height={400}
            className="object-cover w-full h-64 lg:h-auto lg:aspect-square"
            data-ai-hint="guitar music"
          />
          <CardHeader>
            <CardTitle className="text-2xl">{song.title}</CardTitle>
            <CardDescription>{song.artist}</CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2 text-center">Cambiar Tono</h3>
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
                Resetear Tono
              </Button>
            )}

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2 text-center">Compartir</h3>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, "_blank")}
                >
                  <Facebook className="h-5 w-5 text-blue-600" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=${encodeURIComponent(`Check out this song: ${song.title} by ${song.artist}`)}`, "_blank")}
                >
                  <Twitter className="h-5 w-5 text-blue-400" />
                </Button>
                 <Button variant="outline" size="icon" onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this song: ${song.title} by ${song.artist} ${window.location.href}`)}`, "_blank")}>
                  <WhatsAppIcon className="h-5 w-5 text-green-500" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-6">
            <ChordSheet text={song.chords || ""} transpose={transpose} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
