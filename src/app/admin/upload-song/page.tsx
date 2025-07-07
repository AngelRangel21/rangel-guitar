
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UploadSongForm } from '@/components/upload-song-form';
import { ProtectedPage } from '@/components/protected-page';

/**
 * Página que permite a los administradores subir una nueva canción directamente a la biblioteca.
 * Esta página está protegida y solo es accesible para administradores.
 * @returns {JSX.Element} La página con el formulario para subir canciones.
 */
export default function UploadSongPage() {
    return (
        // Componente que protege la página, requiriendo autenticación de administrador.
        <ProtectedPage adminOnly>
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8 flex justify-center">
                    {/* El formulario para subir la nueva canción. */}
                    <UploadSongForm />
                </main>
                <Footer />
            </div>
        </ProtectedPage>
    );
}
