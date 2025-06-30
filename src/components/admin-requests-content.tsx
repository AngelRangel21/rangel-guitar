'use client';

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { useI18n } from "@/context/i18n-context";
import { format } from "date-fns";
import { es, enUS } from 'date-fns/locale';
import type { SongRequest } from "@/services/requests-service";
import Link from "next/link";

interface AdminRequestsContentProps {
  requests: SongRequest[];
}

export function AdminRequestsContent({ requests }: AdminRequestsContentProps) {
  const { isLoaded, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const { t, language } = useI18n();

  useEffect(() => {
    if (isLoaded && (!isAuthenticated || !isAdmin)) {
      router.push('/');
    }
  }, [isLoaded, isAuthenticated, isAdmin, router]);

  if (!isLoaded || !isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center py-24">
        <p>{t('loading')}...</p>
      </div>
    );
  }

  const locale = language === 'es' ? es : enUS;
  const dateFormat = language === 'es' ? "d 'de' MMMM 'de' yyyy 'a las' HH:mm" : "MMM d, yyyy 'at' h:mm a";

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
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
