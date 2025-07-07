
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useI18n } from '@/context/i18n-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

/**
 * Propiedades que el componente ProtectedPage espera recibir.
 */
interface ProtectedPageProps {
  children: React.ReactNode;
  adminOnly?: boolean; // Si es true, la página requerirá permisos de administrador.
}

/**
 * Componente de orden superior (HOC) que protege una página,
 * requiriendo que el usuario esté autenticado y, opcionalmente, que sea administrador.
 * @param {ProtectedPageProps} props - Propiedades del componente.
 * @returns {JSX.Element | null} - Renderiza los hijos si el usuario tiene acceso, o un estado de carga/redirección.
 */
export function ProtectedPage({ children, adminOnly = false }: ProtectedPageProps) {
  const { isLoaded, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const { t } = useI18n();

  // Efecto que se ejecuta para verificar los permisos del usuario.
  useEffect(() => {
    // Solo se ejecuta cuando el estado de autenticación ha terminado de cargarse.
    if (isLoaded) {
      // Si no está autenticado, lo redirige a la página de inicio de sesión.
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      
      // Verifica si el usuario tiene los permisos necesarios (admin si se requiere).
      const isAllowed = !adminOnly || isAdmin;
      
      // Si no tiene permiso, lo redirige a la página de inicio.
      if (!isAllowed) {
        router.push('/');
      }
    }
  }, [isLoaded, isAuthenticated, isAdmin, adminOnly, router]);

  // Determina si se debe mostrar el contenido de la página.
  const isAllowed = !adminOnly || isAdmin;
  const shouldShowContent = isLoaded && isAuthenticated && isAllowed;
  
  if (shouldShowContent) {
      return <>{children}</>;
  }

  // Muestra una pantalla de carga mientras se determina el estado de autenticación o durante la redirección.
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
