'use client';

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import type { RequestSongInput } from "@/ai/flows/request-song-flow";
import { useI18n } from "@/context/i18n-context";
import { format } from "date-fns";
import { es, enUS } from 'date-fns/locale';

interface AdminRequestsContentProps {
  requests: (RequestSongInput & { requestedAt: Date })[];
}

export function AdminRequestsContent({ requests }: AdminRequestsContentProps) {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const { t, language } = useI18n();

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    const timer = setTimeout(() => {
      if (!isAuthenticated || !isAdmin) {
        router.push('/');
      }
    }, 100); // Small delay to allow auth context to initialize
    return () => clearTimeout(timer);
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    // Render a loading state while checking for auth
    return (
      <div className="flex items-center justify-center h-full">
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
            {requests.map((req, index) => (
                <TableRow key={index}>
                    <TableCell className="font-medium">{req.title}</TableCell>
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
