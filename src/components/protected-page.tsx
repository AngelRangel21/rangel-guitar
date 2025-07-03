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
  premiumOnly?: boolean;
}

export function ProtectedPage({ children, adminOnly = false, premiumOnly = false }: ProtectedPageProps) {
  const { isLoaded, isAuthenticated, isAdmin, isPremium } = useAuth();
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    if (isLoaded) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      
      const isAllowed = (!adminOnly || isAdmin) && (!premiumOnly || isPremium || isAdmin);
      
      if (!isAllowed) {
        // In a real app, you might redirect to a specific "access denied" or "upgrade" page.
        router.push('/');
      }
    }
  }, [isLoaded, isAuthenticated, isAdmin, isPremium, adminOnly, premiumOnly, router]);

  const isAllowed = (!adminOnly || isAdmin) && (!premiumOnly || isPremium || isAdmin);
  const shouldShowContent = isLoaded && isAuthenticated && isAllowed;
  
  if (shouldShowContent) {
      return <>{children}</>;
  }

  // Show a loading screen while auth state is being determined or during redirect.
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
