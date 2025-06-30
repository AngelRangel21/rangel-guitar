
'use client';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RequestSongForm } from "@/components/request-song-form";
import { ProtectedPage } from "@/components/protected-page";

export default function RequestSongPage() {
  return (
    <ProtectedPage>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-8">
          <RequestSongForm />
        </main>
        <Footer />
      </div>
    </ProtectedPage>
  );
}
