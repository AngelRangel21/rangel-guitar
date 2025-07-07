'use client';

import type { Song } from "@/lib/types";
import { useI18n } from "@/context/i18n-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopSongListItem } from "./top-song-list-item";

/**
 * Propiedades que el componente TopChartsContent espera recibir.
 */
interface TopChartsContentProps {
    topVisited: Song[];
    topLiked: Song[];
}

/**
 * Componente que muestra el contenido de la página de "Top Canciones".
 * Utiliza pestañas para separar las canciones más visitadas de las que tienen más "me gusta".
 * @param {TopChartsContentProps} props - Propiedades con las listas de canciones.
 * @returns {JSX.Element} El contenido de la página de top canciones.
 */
export function TopChartsContent({ topVisited, topLiked }: TopChartsContentProps) {
    const { t } = useI18n();
    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-center">{t('topChartsPageTitle')}</h1>

            <Tabs defaultValue="visited" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="visited">{t('mostVisited')}</TabsTrigger>
                    <TabsTrigger value="liked">{t('mostLiked')}</TabsTrigger>
                </TabsList>
                {/* Pestaña de las más visitadas */}
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
                {/* Pestaña de las con más "me gusta" */}
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
