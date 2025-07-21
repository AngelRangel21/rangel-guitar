import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AdminRequestsContent } from "@/components/admin-requests-content";
import { ProtectedPage } from "@/components/protected-page";
import { getSongRequestsForServer } from "@/services/requests-service";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

/**
 * Componente de carga que se muestra mientras se obtienen los datos de las solicitudes.
 */
function RequestsLoader() {
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

/**
 * Componente del lado del servidor que obtiene los datos de las solicitudes.
 */
async function RequestsData() {
    const requests = await getSongRequestsForServer();
    return <AdminRequestsContent initialRequests={requests} />;
}


/**
 * Página que muestra la lista de solicitudes de canciones enviadas por los usuarios.
 * Esta página está protegida y solo es accesible para administradores.
 * Ahora es un Server Component que obtiene los datos de forma segura en el servidor.
 * @returns {JSX.Element} La página de solicitudes de administrador.
 */
export default function AdminRequestsPage() {
    return (
        // Componente que protege la página, requiriendo autenticación de administrador.
        <ProtectedPage adminOnly>
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <Suspense fallback={<RequestsLoader />}>
                        <RequestsData />
                    </Suspense>
                </main>
                <Footer />
            </div>
        </ProtectedPage>
    );
}
