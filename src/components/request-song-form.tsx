'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/context/i18n-context";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { addSongRequest } from "@/lib/client/requests";
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
  title: z.string().min(2, { message: 'songTitleRequired' }),
  artist: z.string().min(2, { message: 'artistNameRequired' }),
});

export function RequestSongForm() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      artist: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await addSongRequest(values);
      toast({
        title: t('requestSentTitle'),
        description: `¡Tu solicitud para "${values.title}" ha sido enviada! La revisaremos pronto.`
      });
      form.reset();
    } catch (error) {
       toast({
        variant: "destructive",
        title: t('requestErrorTitle'),
        description: t('requestErrorDescription'),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t('requestSongTitle')}</CardTitle>
        <CardDescription>{t('requestSongDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('songTitleLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('songTitlePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="artist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('artistLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('artistPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('sending') + '...' : t('sendRequest')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
