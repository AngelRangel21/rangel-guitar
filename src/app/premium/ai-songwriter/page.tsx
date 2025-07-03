'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProtectedPage } from '@/components/protected-page';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/context/i18n-context';
import { useToast } from '@/hooks/use-toast';
import { generateSongAction } from './actions';
import { SongWriterInputSchema, type SongWriterOutput } from '@/ai/schemas/song-writer-schemas';
import { ChordSheet } from '@/components/chord-sheet';
import { Wand2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function AiSongwriterForm({
    setGeneratedSong,
    setIsLoading,
    isLoading
}: {
    setGeneratedSong: (song: SongWriterOutput | null) => void;
    setIsLoading: (loading: boolean) => void;
    isLoading: boolean;
}) {
    const { t } = useI18n();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof SongWriterInputSchema>>({
        resolver: zodResolver(SongWriterInputSchema),
        defaultValues: {
            topic: '',
            genre: '',
        },
    });

    async function onSubmit(values: z.infer<typeof SongWriterInputSchema>) {
        setIsLoading(true);
        setGeneratedSong(null);
        const result = await generateSongAction(values);
        setIsLoading(false);

        if (result.error || !result.song) {
            toast({
                variant: 'destructive',
                title: t('error'),
                description: t('aiSongwriterError'),
            });
        } else {
            setGeneratedSong(result.song);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('songTopicLabel')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('songTopicPlaceholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('songGenreLabel')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('songGenrePlaceholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    {isLoading ? t('generatingSong') : t('generateSongButton')}
                </Button>
            </form>
        </Form>
    );
}

function LoadingSkeleton() {
    return (
        <Card className="mt-8 animate-pulse">
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/4 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/6" />
            </CardContent>
        </Card>
    );
}


export default function AiSongwriterPage() {
    const { t } = useI18n();
    const [isLoading, setIsLoading] = useState(false);
    const [generatedSong, setGeneratedSong] = useState<SongWriterOutput | null>(null);

    return (
        <ProtectedPage premiumOnly>
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8 flex justify-center">
                    <div className="w-full max-w-2xl space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('aiSongwriterTitle')}</CardTitle>
                                <CardDescription>{t('aiSongwriterDescription')}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AiSongwriterForm 
                                    setGeneratedSong={setGeneratedSong}
                                    setIsLoading={setIsLoading}
                                    isLoading={isLoading}
                                />
                            </CardContent>
                        </Card>
                        
                        {isLoading && <LoadingSkeleton />}

                        {generatedSong && (
                             <Card className="animate-fade-in-up">
                                <CardHeader>
                                    <CardTitle>{generatedSong.title}</CardTitle>
                                    <CardDescription>{t('byArtist', { artist: t('aiComposer')})}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ChordSheet text={generatedSong.chords} />
                                </CardContent>
                             </Card>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </ProtectedPage>
    );
}
