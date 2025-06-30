import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { EditSongForm } from '@/components/edit-song-form';
import { songs } from "@/lib/data";
import { notFound } from "next/navigation";
import { ProtectedPage } from "@/components/protected-page";

export default function EditSongPage({ params }: { params: { id: string } }) {
    const song = songs.find(s => s.id === parseInt(params.id));
    
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
