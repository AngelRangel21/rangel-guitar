'use client';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AdminRequestsContent } from "@/components/admin-requests-content";
import { ProtectedPage } from "@/components/protected-page";

/**
 * Página que muestra la lista de solicitudes de canciones enviadas por los usuarios.
 * Esta página está protegida y solo es accesible para administradores.
 * El contenido real de la tabla de solicitudes se maneja en el componente `AdminRequestsContent`.
 * @returns {JSX.Element} La página de solicitudes de administrador.
 */
export default function AdminRequestsPage() {
    return (
        // Componente que protege la página, requiriendo autenticación de administrador.
        <ProtectedPage adminOnly>
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    {/* Componente que renderiza el contenido principal, incluyendo la tabla de solicitudes. */}
                    <AdminRequestsContent />
                </main>
                <Footer />
            </div>
        </ProtectedPage>
    );
}
