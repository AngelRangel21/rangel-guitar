
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UploadSongForm } from '@/components/upload-song-form';
import { ProtectedPage } from '@/components/protected-page';

export default function UploadSongPage() {
    return (
        <ProtectedPage adminOnly>
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8 flex justify-center">
                    <UploadSongForm />
                </main>
                <Footer />
            </div>
        </ProtectedPage>
    );
}
