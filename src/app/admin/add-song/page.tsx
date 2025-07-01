
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AddSongForm } from '@/components/add-song-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ProtectedPage } from '@/components/protected-page';
import { Skeleton } from '@/components/ui/skeleton';

// Inner component that uses the hook, to be wrapped in Suspense
function AddSongContent() {
    const searchParams = useSearchParams();

    const requestId = searchParams.get('id');
    const title = searchParams.get('title');
    const artist = searchParams.get('artist');
    
    if (!requestId || !title || !artist) {
        return (
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Información de la solicitud inválida o faltante. Por favor, vuelva a la lista de solicitudes e inténtelo de nuevo.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <AddSongForm
            requestId={requestId}
            initialTitle={title}
            initialArtist={artist}
        />
    );
}

// A loader component with a skeleton UI to show while content is loading
function AddSongLoader() {
    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>
    );
}


// The default export for the page, which sets up the layout and Suspense boundary
export default function AddSongPage() {
    return (
        <ProtectedPage adminOnly>
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8 flex justify-center">
                    <Suspense fallback={<AddSongLoader />}>
                        <AddSongContent />
                    </Suspense>
                </main>
                <Footer />
            </div>
        </ProtectedPage>
    );
}
