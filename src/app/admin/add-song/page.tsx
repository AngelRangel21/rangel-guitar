'use client';

import { useSearchParams } from 'next/navigation';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AddSongForm } from '@/components/add-song-form';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useI18n } from '@/context/i18n-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AddSongPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { t } = useI18n();
    const { isLoaded, isAuthenticated, isAdmin } = useAuth();

    const requestId = searchParams.get('id');
    const title = searchParams.get('title');
    const artist = searchParams.get('artist');
    
    useEffect(() => {
        if (isLoaded && (!isAuthenticated || !isAdmin)) {
            router.push('/');
        }
    }, [isLoaded, isAuthenticated, isAdmin, router]);

    if (!isLoaded || !isAuthenticated || !isAdmin) {
        return (
          <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow flex items-center justify-center">
              <p>{t('loading')}...</p>
            </main>
            <Footer />
          </div>
        );
    }
    
    if (!requestId || !title || !artist) {
        return (
             <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8 flex justify-center">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle>Error</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Información de la solicitud inválida o faltante. Por favor, vuelva a la lista de solicitudes e inténtelo de nuevo.</p>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 flex justify-center">
                <AddSongForm
                    requestId={requestId}
                    initialTitle={title}
                    initialArtist={artist}
                />
            </main>
            <Footer />
        </div>
    );
}
