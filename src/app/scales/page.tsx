import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScalesPageContent } from "@/components/scales-page-content";
import { rootNotes, scaleTypes } from "@/lib/scales-data";
import type { Metadata } from 'next';

/**
 * Metadatos para la página de la Biblioteca de Escalas.
 * Esencial para el SEO y para cómo se muestra la página al compartirla en redes sociales.
 */
export const metadata: Metadata = {
  title: 'Biblioteca de Escalas',
  description: 'Explora y aprende escalas musicales para guitarra y teclado. Encuentra todas las escalas mayores y menores.',
  openGraph: {
    title: 'Biblioteca de Escalas | Rangel Guitar',
    description: 'Explora y aprende escalas musicales para guitarra y teclado. Encuentra todas las escalas mayores y menores.',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: 'Biblioteca de Escalas en Rangel Guitar',
      },
    ],
  },
}

/**
 * Página que muestra la herramienta de biblioteca de escalas musicales.
 * Es un Server Component que simplemente importa los datos de las escalas (notas y tipos)
 * y los pasa a un Client Component para su renderizado interactivo.
 * @returns {JSX.Element} La página de la biblioteca de escalas.
 */
export default function ScalesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      {/* Componente de cliente que maneja la lógica de selección y visualización de escalas. */}
      <ScalesPageContent rootNotes={rootNotes} scaleTypes={scaleTypes} />
      <Footer />
    </div>
  );
}
