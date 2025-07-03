'use client';

import { useState, useRef } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/context/i18n-context';
import { useToast } from '@/hooks/use-toast';
import { lyricAssistantAction } from './actions';
import { Wand2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { LyricAssistantInputSchema } from '@/ai/schemas/lyric-assistant-schemas';

const formSchema = LyricAssistantInputSchema.pick({ topic: true, genre: true });

export default function LyricAssistantPage() {
    const { t } = useI18n();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isRefining, setIsRefining] = useState(false);
    const [lyrics, setLyrics] = useState('');
    const [selectedText, setSelectedText] = useState('');
    const [refinementInstruction, setRefinementInstruction] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            topic: '',
            genre: '',
        },
    });

    async function onInitialSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setLyrics('');
        const result = await lyricAssistantAction(values);
        setIsLoading(false);

        if (result.error || !result.lyrics) {
            toast({
                variant: 'destructive',
                title: t('error'),
                description: t('aiSongwriterError'),
            });
        } else {
            setLyrics(result.lyrics);
        }
    }

    async function handleRefine() {
        if (!selectedText || !refinementInstruction) return;

        setIsRefining(true);
        const result = await lyricAssistantAction({
            topic: '', // Not needed for refinement
            genre: '', // Not needed for refinement
            originalLyrics: lyrics,
            selectedText: selectedText,
            instruction: refinementInstruction,
        });
        setIsRefining(false);

        if (result.error || !result.lyrics) {
            toast({
                variant: 'destructive',
                title: t('error'),
                description: t('aiSongwriterError'),
            });
        } else {
            setLyrics(result.lyrics);
            setSelectedText('');
            setRefinementInstruction('');
        }
    }

    const handleSelectionChange = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            const text = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
            setSelectedText(text);
        }
    };

    return (
        <ProtectedPage premiumOnly>
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8 flex justify-center">
                    <div className="w-full max-w-2xl space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('lyricAssistantTitle')}</CardTitle>
                                <CardDescription>{t('lyricAssistantDescription')}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onInitialSubmit)} className="space-y-6">
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
                                            {isLoading ? t('generatingLyrics') : t('generateLyricsButton')}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                        
                        {isLoading && <Skeleton className="w-full h-96" />}

                        {lyrics && (
                             <Card className="animate-fade-in-up">
                                <CardHeader>
                                    <CardTitle>{t('generatedLyrics')}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Textarea
                                        ref={textareaRef}
                                        value={lyrics}
                                        onChange={(e) => setLyrics(e.target.value)}
                                        onSelect={handleSelectionChange}
                                        rows={15}
                                        className="font-mono"
                                    />
                                    <div>
                                        <h3 className="font-semibold mb-2">{t('refineSelection')}</h3>
                                        <div className="space-y-2">
                                            <Input 
                                                value={refinementInstruction}
                                                onChange={(e) => setRefinementInstruction(e.target.value)}
                                                placeholder={t('refinementInstructionPlaceholder')}
                                                disabled={!selectedText || isRefining}
                                            />
                                            <Button onClick={handleRefine} disabled={!selectedText || !refinementInstruction || isRefining} className="w-full">
                                                {isRefining ? t('refiningLyrics') : t('refineSelection')}
                                            </Button>
                                        </div>
                                        {!selectedText && <p className="text-xs text-muted-foreground mt-2">{t('selectTextToRefine')}</p>}
                                    </div>
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
