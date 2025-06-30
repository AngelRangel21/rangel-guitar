'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useI18n } from '@/context/i18n-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

interface ProtectedPageProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedPage({ children, adminOnly = false }: ProtectedPageProps) {
  const { isLoaded, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    if (isLoaded) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (adminOnly && !isAdmin) {
        router.push('/');
      }
    }
  }, [isLoaded, isAuthenticated, isAdmin, adminOnly, router]);

  const shouldShowLoading = !isLoaded || !isAuthenticated || (adminOnly && !isAdmin);

  if (shouldShowLoading) {
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
  
  return <>{children}</>;
}
