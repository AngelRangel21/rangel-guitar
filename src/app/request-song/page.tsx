
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RequestSongForm } from "@/components/request-song-form";

export default function RequestSongPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    // No timer needed now as AuthProvider handles loading state
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // The AuthProvider now shows a loading screen, so we can assume isAuthenticated is stable here.
  // If still not authenticated, it means the user should not be here.
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-8">
        <RequestSongForm />
      </main>
      <Footer />
    </div>
  );
}
