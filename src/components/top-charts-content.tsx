'use client';

import type { Song } from "@/lib/types";
import { useI18n } from "@/context/i18n-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopSongListItem } from "./top-song-list-item";

interface TopChartsContentProps {
    topVisited: Song[];
    topLiked: Song[];
}

export function TopChartsContent({ topVisited, topLiked }: TopChartsContentProps) {
    const { t } = useI18n();
    return (
        <div className="space-y-8 opacity-0 animate-fade-in-up">
            <h1 className="text-4xl font-bold text-center">{t('topChartsPageTitle')}</h1>

            <Tabs defaultValue="visited" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="visited">{t('mostVisited')}</TabsTrigger>
                    <TabsTrigger value="liked">{t('mostLiked')}</TabsTrigger>
                </TabsList>
                <TabsContent value="visited">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('mostVisitedSongs')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            {topVisited.map((song, index) => (
                                <TopSongListItem key={song.id} song={song} rank={index + 1} type="visits" />
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="liked">
                     <Card>
                        <CardHeader>
                            <CardTitle>{t('mostLikedSongs')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            {topLiked.map((song, index) => (
                                <TopSongListItem key={song.id} song={song} rank={index + 1} type="likes" />
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
