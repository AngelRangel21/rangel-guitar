"use client";

import { useState, useEffect } from "react";
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
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

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
          {song.video ? (
            <div className="w-full aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${song.video}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <Image
              src={song.coverArt}
              alt={`Cover art for ${song.title}`}
              width={400}
              height={400}
              className="w-full h-auto object-cover"
              data-ai-hint="guitar music"
            />
          )}
          <CardHeader>
            <CardTitle className="text-2xl">{song.title}</CardTitle>
            <CardDescription>{song.artist}</CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2 text-center">{t('changeTone')}</h3>
            <div className="flex items-center justify-between gap-4">
              <Button variant="outline" size="icon" onClick={() => setTranspose(t => t - 1)} aria-label={t('decreaseSemitone')}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold text-lg w-32 text-center" aria-live="polite">{getTransposedKeyText()}</span>
              <Button variant="outline" size="icon" onClick={() => setTranspose(t => t + 1)} aria-label={t('increaseSemitone')}>
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
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, "_blank")}
                  aria-label={t('shareOnFacebook')}
                >
                  <Facebook className="h-5 w-5 text-blue-600" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${currentUrl}&text=${encodeURIComponent(shareText)}`, "_blank")}
                  aria-label={t('shareOnTwitter')}
                >
                  <Twitter className="h-5 w-5 text-blue-400" />
                </Button>
                 <Button variant="outline" size="icon" onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`, "_blank")} aria-label={t('shareOnWhatsApp')}>
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
