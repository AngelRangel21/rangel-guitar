import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { EditSongForm } from '@/components/edit-song-form';
import { getSongBySlug } from "@/services/songs-service";
import { notFound } from "next/navigation";
import { ProtectedPage } from "@/components/protected-page";

export default async function EditSongPage({ params }: { params: { slug: string } }) {
    const song = await getSongBySlug(params.slug);
    
    if (!song) {
        notFound();
    }

    return (
        <ProtectedPage adminOnly>
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8 flex justify-center">
                    <EditSongForm song={song} />
                </main>
                <Footer />
            </div>
        </ProtectedPage>
    );
}
