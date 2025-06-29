'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useI18n } from '@/context/i18n-context';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RequestSongForm } from "@/components/request-song-form";

export default function RequestSongPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    // Redirect to login if not authenticated
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push('/login');
      }
    }, 100); // Small delay to allow auth context to initialize
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p>{t('loading')}...</p>
        </main>
        <Footer />
      </div>
    );
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
