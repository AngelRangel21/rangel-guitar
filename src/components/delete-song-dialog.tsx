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
import { revalidateAndRedirectAfterDelete } from '@/app/songs/[slug]/actions';
import { deleteSong } from '@/lib/client/songs';

/**
 * Propiedades que el componente DeleteSongDialog espera recibir.
 */
interface DeleteSongDialogProps {
  song: Song;
  children: React.ReactNode; // El elemento que activará el diálogo (ej. un botón).
}

/**
 * Componente que muestra un diálogo de confirmación para eliminar una canción.
 * Es utilizado por los administradores en la página de la canción.
 * @param {DeleteSongDialogProps} props - Propiedades del componente.
 * @returns {JSX.Element} El diálogo de alerta.
 */
export function DeleteSongDialog({ song, children }: DeleteSongDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useI18n();

  /**
   * Maneja la lógica de eliminación cuando el usuario confirma la acción.
   */
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // Llama a la función del cliente para eliminar la canción de Firestore.
      await deleteSong(song.id);
      // Llama a la acción del servidor para revalidar rutas y redirigir.
      await revalidateAndRedirectAfterDelete();
    } catch (error: any) {
      // La redirección de Next.js en una acción de servidor lanza un error, se debe capturar.
      if (error.digest?.startsWith('NEXT_REDIRECT')) {
          return;
      }
      
      // Maneja errores reales que no son de redirección.
      console.error("Failed to delete song:", error);
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
