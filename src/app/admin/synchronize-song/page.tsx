import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProtectedPage } from "@/components/protected-page";
import { getSongs } from "@/services/songs-service";
import { SynchronizeSongForm } from "@/components/synchronize-song-form";

/**
 * Page that allows administrators to synchronize a song's audio with its lyrics.
 * This page is protected and only accessible by administrators.
 * @returns {JSX.Element} The page with the form for synchronizing songs.
 */
export default async function SynchronizeSongPage() {
    const songs = await getSongs();

    return (
        // Protects the page, requiring administrator authentication.
        <ProtectedPage adminOnly>
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8 flex justify-center">
                    {/* The form to select a song and upload audio for synchronization. */}
                    <SynchronizeSongForm songs={songs} />
                </main>
                <Footer />
            </div>
        </ProtectedPage>
    );
}
