
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/context/i18n-context';
import { useToast } from '@/hooks/use-toast';
import { analyzeSong, AnalyzeSongOutput } from '@/ai/flows/song-analyzer-flow';
import { Loader2 } from 'lucide-react';
import { ChordSheet } from '@/components/chord-sheet';
import { ProtectedPage } from '@/components/protected-page';


const formSchema = z.object({
  audioFile: z
    .any()
    .refine((files) => files?.length === 1, 'Audio file is required.')
    .refine((files) => files?.[0]?.size <= 10 * 1024 * 1024, `Max file size is 10MB.`)
    .refine(
      (files) => ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'].includes(files?.[0]?.type),
      '.mp3, .wav, and .ogg files are accepted.'
    ),
});

function AnalyzeSongPageContent() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeSongOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setAnalysisResult(null);
    const file = values.audioFile[0];

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const audioDataUri = reader.result as string;
        const result = await analyzeSong({ audioDataUri });
        setAnalysisResult(result);
      };
      reader.onerror = (error) => {
        throw new Error('Error reading file: ' + error);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('analysisFailed'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center gap-8">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>{t('analyzeSongTitle')}</CardTitle>
            <CardDescription>{t('analyzeSongDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="audioFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('audioFile')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="file" 
                          accept="audio/mp3,audio/wav,audio/ogg"
                          onChange={(e) => field.onChange(e.target.files)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? t('analyzing') : t('analyzeSongButton')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {analysisResult && (
          <Card className="w-full max-w-2xl opacity-0 animate-content-in">
             <CardHeader>
                <CardTitle>{t('analysisResult')}</CardTitle>
             </CardHeader>
             <CardContent>
                <ChordSheet text={analysisResult.chords} />
             </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function AnalyzeSongPage() {
    return (
        <ProtectedPage>
            <AnalyzeSongPageContent />
        </ProtectedPage>
    )
}
