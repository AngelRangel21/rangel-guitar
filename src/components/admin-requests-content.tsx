'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { useI18n } from "@/context/i18n-context";
import { format } from "date-fns";
import { es, enUS } from 'date-fns/locale';
import type { SongRequest } from "@/lib/types";
import Link from "next/link";
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import { revalidateAfterRequestDelete } from '@/app/admin/requests/actions';
import { deleteSongRequest } from '@/lib/client/requests';
import { useToast } from '@/hooks/use-toast';

interface AdminRequestsContentProps {
    initialRequests: SongRequest[];
}

/**
 * Componente de cliente que muestra el contenido de la página de solicitudes de administrador.
 * Renderiza una tabla con las solicitudes de canciones pendientes.
 * @returns {JSX.Element} El componente de contenido de solicitudes.
 */
export function AdminRequestsContent({ initialRequests }: AdminRequestsContentProps) {
  // Estados para manejar las solicitudes, el estado de carga y la internacionalización.
  const [requests, setRequests] = useState<SongRequest[]>(initialRequests);
  const { language, t } = useI18n();
  const { toast } = useToast();
  
  // Configura el local para el formato de fecha según el idioma seleccionado.
  const locale = language === 'es' ? es : enUS;
  const dateFormat = language === 'es' ? "d 'de' MMMM 'de' yyyy 'a las' HH:mm" : "MMM d, yyyy 'at' h:mm a";

  /**
   * Maneja la eliminación de una solicitud de canción.
   * @param {string} requestId - El ID de la solicitud a eliminar.
   */
  const handleDelete = async (requestId: string) => {
    const originalRequests = [...requests]; // Guarda el estado original para posible reversión.
    
    // Actualización optimista: elimina la solicitud de la UI inmediatamente.
    setRequests(currentRequests => currentRequests.filter(req => req.id !== requestId));

    try {
      // Realiza la eliminación en la base de datos.
      await deleteSongRequest(requestId);
      // Revalida la ruta del lado del servidor.
      await revalidateAfterRequestDelete();
      toast({
          title: t('requestDeletedTitle'),
          description: t('requestDeletedDescription')
      });
    } catch(error) {
      // Si hay un error, revierte la UI al estado original.
      setRequests(originalRequests);
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('songRequestDeleteError')
      });
    }
  };

  // Renderiza la tabla de solicitudes.
  return (
    <Card>
    <CardHeader>
        <CardTitle>{t('songRequestsTitle')}</CardTitle>
        <CardDescription>{t('songRequestsDescription')}</CardDescription>
    </CardHeader>
    <CardContent>
        <Table>
            {requests.length === 0 && (
                <TableCaption>{t('noPendingRequests')}</TableCaption>
            )}
        <TableHeader>
            <TableRow>
                <TableHead>{t('tableTitle')}</TableHead>
                <TableHead>{t('tableArtist')}</TableHead>
                <TableHead>{t('tableRequestDate')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {requests.map((req) => (
                <TableRow key={req.id}>
                    <TableCell className="font-medium">
                        {/* Enlace para ir a la página de agregar canción con los datos pre-rellenados. */}
                        <Link href={`/admin/add-song?id=${req.id}&title=${encodeURIComponent(req.title)}&artist=${encodeURIComponent(req.artist)}`} className="hover:underline">
                            {req.title}
                        </Link>
                    </TableCell>
                    <TableCell>{req.artist}</TableCell>
                    <TableCell>{format(new Date(req.requestedAt), dateFormat, { locale })}</TableCell>
                    <TableCell className="text-right">
                       <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={() => handleDelete(req.id)}
                          aria-label={t('deleteRequest')}
                       >
                          <Trash2 className="h-4 w-4 text-destructive" />
                       </Button>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
        </Table>
    </CardContent>
    </Card>
  );
}
