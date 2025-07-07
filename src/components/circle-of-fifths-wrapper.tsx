'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Carga dinámica del componente CircleOfFifths.
 * Esto significa que el código del componente no se incluirá en el paquete de JavaScript inicial,
 * sino que se cargará solo cuando sea necesario.
 *
 * Opciones:
 * - `ssr: false`: Desactiva el renderizado del lado del servidor para este componente. Es necesario
 *   porque el componente del círculo de quintas depende de APIs del navegador y de la interacción del usuario.
 * - `loading`: Especifica un componente de carga (en este caso, un esqueleto) que se mostrará
 *   mientras el componente principal se está cargando en el cliente.
 */
const DynamicCircleOfFifths = dynamic(
  () => import('@/components/circle-of-fifths').then(mod => mod.CircleOfFifths),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-[440px] w-[440px] rounded-full" />
  }
);

/**
 * Componente "wrapper" o envoltorio que se encarga de renderizar el Círculo de Quintas
 * cargado dinámicamente con su estado de carga.
 * @returns {JSX.Element} El componente del círculo de quintas dinámico.
 */
export function CircleOfFifthsWrapper() {
  return <DynamicCircleOfFifths />;
}
