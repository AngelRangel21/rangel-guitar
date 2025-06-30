'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Song } from '@/lib/types';
import { useI18n } from '@/context/i18n-context';
import { deleteSongAction } from '@/app/songs/[id]/actions';
import { Trash2 } from 'lucide-react';

interface DeleteSongDialogProps {
  song: Song;
  children: React.ReactNode;
}

export function DeleteSongDialog({ song, children }: DeleteSongDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useI18n();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteSongAction(song.id);
      // The action will handle redirection on success.
    } catch (error: any) {
      // The `redirect` in a server action throws an error, which we need to catch.
      // However, we don't want to show an error toast for a successful redirect.
      if (error.digest?.startsWith('NEXT_REDIRECT')) {
          return; // Let Next.js handle the redirect
      }
      
      // Handle actual errors
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('songDeleteError'),
      });
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('deleteSongConfirmTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('deleteSongConfirmDescription', { title: song.title })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading} className="bg-destructive hover:bg-destructive/90">
            {isLoading ? t('deleting') : t('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
