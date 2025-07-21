import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProtectedPage } from "@/components/protected-page";
import { getArtists } from "@/services/songs-service";
import { AdminArtistsContent } from "@/components/admin-artists-content";

/**
 * Page for administrators to manage artists.
 * @returns {Promise<JSX.Element>} The manage artists page.
 */
export default async function AdminArtistsPage() {
    const artists = await getArtists();

    return (
        <ProtectedPage adminOnly>
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <AdminArtistsContent initialArtists={artists} />
                </main>
                <Footer />
            </div>
        </ProtectedPage>
    );
}
