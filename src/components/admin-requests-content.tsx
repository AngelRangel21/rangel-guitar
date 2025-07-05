'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { useI18n } from "@/context/i18n-context";
import { format } from "date-fns";
import { es, enUS } from 'date-fns/locale';
import type { SongRequest } from "@/lib/types";
import Link from "next/link";
import { ProtectedPage } from "./protected-page";
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import { revalidateAfterRequestDelete } from '@/app/admin/requests/actions';
import { deleteSongRequest, getSongRequests } from '@/lib/client/requests';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminRequestsContent() {
  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language, t } = useI18n();
  const { toast } = useToast();
  
  useEffect(() => {
    getSongRequests()
        .then(setRequests)
        .catch(error => {
            console.error("Failed to fetch song requests:", error);
            toast({
                variant: "destructive",
                title: t('error'),
                description: "No se pudieron cargar las solicitudes de canciones.",
            });
        })
        .finally(() => setIsLoading(false));
  }, [toast, t]);

  const locale = language === 'es' ? es : enUS;
  const dateFormat = language === 'es' ? "d 'de' MMMM 'de' yyyy 'a las' HH:mm" : "MMM d, yyyy 'at' h:mm a";

  const handleDelete = async (requestId: string) => {
    const originalRequests = [...requests];
    setRequests(currentRequests => currentRequests.filter(req => req.id !== requestId));

    try {
      await deleteSongRequest(requestId);
      await revalidateAfterRequestDelete();
      toast({
          title: t('requestDeletedTitle'),
          description: t('requestDeletedDescription')
      });
    } catch(error) {
      setRequests(originalRequests);
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('songRequestDeleteError')
      });
    }
  };

  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
            </CardContent>
        </Card>
    );
  }

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
