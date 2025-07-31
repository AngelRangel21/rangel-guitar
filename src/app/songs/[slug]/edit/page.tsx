import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { EditSongForm } from '@/components/edit-song-form';
import { getSongBySlug } from "@/services/songs-service";
import { notFound } from "next/navigation";
import { ProtectedPage } from "@/components/protected-page";


/**
 * Página para editar los detalles de una canción existente.
 * Esta página está protegida y solo es accesible para administradores.
 * @param {{ params: { slug: string } }} props - Las propiedades de la página, incluyendo el slug de la canción.
 * @returns {Promise<JSX.Element>} La página de edición de la canción.
 */
export default async function EditSongPage({ params }: { params: { slug: string } }) {
    // Obtiene los datos de la canción a partir de su slug.
    const song = await getSongBySlug(params.slug);
    
    // Si la canción no se encuentra, muestra la página de error 404.
    if (!song) {
        notFound();
    }

    return (
        // Componente que protege la página, requiriendo autenticación de administrador.
        <ProtectedPage adminOnly>
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8 flex justify-center">
                    {/* El formulario de edición, pre-rellenado con los datos de la canción. */}
                    <EditSongForm song={song} />
                </main>
                <Footer />
            </div>
        </ProtectedPage>
    );
}
