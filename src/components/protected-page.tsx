'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useI18n } from '@/context/i18n-context';

interface ProtectedPageProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedPage({ children, adminOnly = false }: ProtectedPageProps) {
  const { isLoaded, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const { t } = useI18n();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  // Mostrar loading solo después de un pequeño delay para evitar flashes
  useEffect(() => {
    const timer = setTimeout(() => setShowLoading(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // Manejar redirecciones
  useEffect(() => {
    if (isLoaded && !isRedirecting) {
      if (!isAuthenticated) {
        setIsRedirecting(true);
        router.push('/login');
        return;
      }
      
      const isAllowed = !adminOnly || isAdmin;
      
      if (!isAllowed) {
        setIsRedirecting(true);
        router.push('/');
      }
    }
  }, [isLoaded, isAuthenticated, isAdmin, adminOnly, router, isRedirecting]);

  // Determinar si mostrar el contenido
  const isAllowed = !adminOnly || isAdmin;
  const shouldShowContent = isLoaded && isAuthenticated && isAllowed;
  
  // Si ya está todo cargado y tiene permisos, mostrar contenido inmediatamente
  if (shouldShowContent) {
    return <>{children}</>;
  }

  // Si está redirigiendo, no mostrar nada o mostrar mensaje de redirección
  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('redirecting')}...
          </p>
        </div>
      </div>
    );
  }

  // Si no está cargado pero aún no debe mostrar loading, no mostrar nada
  if (!isLoaded && !showLoading) {
    return null;
  }

  // Pantalla de carga minimalista
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('loading')}...
        </p>
      </div>
    </div>
  );
}