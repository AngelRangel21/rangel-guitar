"use client";

import { useState } from "react";
import type { Song } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChordSheet } from "./chord-sheet";
import { Minus, Plus, Facebook, Twitter } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import Image from "next/image";
import { useI18n } from "@/context/i18n-context";

export function SongDisplay({ song }: { song: Song }) {
  const [transpose, setTranspose] = useState(0);
  const { t } = useI18n();

  const getTransposedKeyText = () => {
    if (transpose === 0) return t('originalKey');
    const direction = transpose > 0 ? `+${transpose}` : transpose;
    return `${direction} ${t('semitones')}`;
  };

  const shareText = t('shareText', { title: song.title, artist: song.artist });

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
            <h3 className="text-lg font-semibold mb-2 text-center">{t('changeTone')}</h3>
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
                {t('resetTone')}
              </Button>
            )}

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2 text-center">{t('share')}</h3>
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
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=${encodeURIComponent(shareText)}`, "_blank")}
                >
                  <Twitter className="h-5 w-5 text-blue-400" />
                </Button>
                 <Button variant="outline" size="icon" onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${window.location.href}`)}`, "_blank")}>
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
