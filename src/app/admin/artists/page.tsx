import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProtectedPage } from "@/components/protected-page";
import { AdminArtistsContent } from "@/components/admin-artists-content";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function ArtistsLoader() {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </CardContent>
        </Card>
    )
}


/**
 * Page for administrators to manage artists.
 * Data is now fetched on the client side to ensure permissions are checked first.
 * @returns {JSX.Element} The manage artists page.
 */
export default function AdminArtistsPage() {
    return (
        <ProtectedPage adminOnly>
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <Suspense fallback={<ArtistsLoader />}>
                        <AdminArtistsContent />
                    </Suspense>
                </main>
                <Footer />
            </div>
        </ProtectedPage>
    );
}
