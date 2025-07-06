
"use client";

import { useState, useEffect, useRef } from "react";
import type { Song } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChordSheet } from "./chord-sheet";
import { Minus, Plus, Facebook, Twitter, Heart, Pencil, Trash2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import Image from "next/image";
import { useI18n } from "@/context/i18n-context";
import { useAuth } from "@/context/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeleteSongDialog } from "./delete-song-dialog";
import Link from 'next/link';
import { SongCard } from "./song-card";
import { incrementVisitCount } from "@/lib/client/songs";
import { revalidateAfterVisit } from "@/app/songs/[slug]/actions";

export function SongDisplay({ song, suggestedSongs }: { song: Song, suggestedSongs: Song[] }) {
  const [transpose, setTranspose] = useState(0);
  const { t } = useI18n();
  const { isAuthenticated, isFavorite, toggleFavorite, isAdmin } = useAuth();
  const [currentUrl, setCurrentUrl] = useState('');
  const visitLoggedRef = useRef(false);

  useEffect(() => {
    setCurrentUrl(window.location.href);

    if (!visitLoggedRef.current) {
      const logVisit = async () => {
        try {
          await incrementVisitCount(song.id);
          await revalidateAfterVisit();
        } catch (error) {
          console.error("Failed to increment visit count:", error);
        }
      };
      logVisit();
      visitLoggedRef.current = true;
    }
  }, [song.id]);

  const getTransposedKeyText = () => {
    if (transpose === 0) return t('originalKey');
    const direction = transpose > 0 ? `+${transpose}` : transpose;
    return `${direction} ${t('semitones')}`;
  };

  const shareText = t('shareText', { title: song.title, artist: song.artist });

  return (
    <div>
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
                width={600}
                height={600}
                className="w-full h-auto object-cover"
                data-ai-hint="guitar music"
              />
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{song.title}</CardTitle>
                  <CardDescription>{song.artist}</CardDescription>
                </div>
                {isAuthenticated && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(song.id, song.slug)}
                    aria-label={isFavorite(song.id) ? t('removeFromFavorites') : t('addToFavorites')}
                    className="rounded-full"
                  >
                    <Heart className={`h-6 w-6 transition-colors ${isFavorite(song.id) ? 'fill-red-500 text-red-500' : 'text-foreground/70'}`} />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isAdmin && (
                <div className="mb-8 p-4 bg-secondary/50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-center">{t('adminActions')}</h3>
                  <div className="flex justify-center gap-4">
                    <Button asChild variant="outline">
                      <Link href={`/songs/${song.slug}/edit`}>
                        <Pencil className="mr-2" /> {t('edit')}
                      </Link>
                    </Button>
                    <DeleteSongDialog song={song}>
                      <Button variant="destructive">
                        <Trash2 className="mr-2" /> {t('delete')}
                      </Button>
                    </DeleteSongDialog>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
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
                </div>
              </div>

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
          <Tabs defaultValue="chords" className="w-full">
            <TabsList>
              <TabsTrigger value="chords">{t('chordsAndLyrics')}</TabsTrigger>
              <TabsTrigger value="lyrics">{t('lyricsOnly')}</TabsTrigger>
            </TabsList>
            <TabsContent value="chords">
              <Card>
                <CardContent className="p-6">
                  <ChordSheet text={song.chords || ""} transpose={transpose} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="lyrics">
              <Card>
                <CardContent className="p-6">
                  <div className="whitespace-pre-wrap font-sans text-base leading-relaxed">
                    {song.lyrics || ""}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {suggestedSongs.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">{t('suggestedSongs')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {suggestedSongs.map(s => (
              <SongCard key={s.id} song={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
