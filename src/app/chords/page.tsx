import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { majorChords, minorChords, seventhChords } from "@/lib/chords-data";
import { ChordsPageContent } from "@/components/chords-page-content";
import type { Metadata } from 'next';

/**
 * Metadatos para la página de la Biblioteca de Acordes.
 * Esencial para el SEO y la forma en que se muestra la página al compartirla.
 */
export const metadata: Metadata = {
  title: 'Biblioteca de Acordes',
  description: 'Explora una biblioteca completa de acordes de guitarra. Encuentra diagramas para acordes mayores, menores y de séptima para mejorar tu forma de tocar.',
  openGraph: {
    title: 'Biblioteca de Acordes | Rangel Guitar',
    description: 'Explora una biblioteca completa de acordes de guitarra en Rangel Guitar.',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: 'Biblioteca de Acordes de Rangel Guitar',
      },
    ],
  },
}

/**
 * Página que muestra la biblioteca de acordes.
 * Es un Server Component que simplemente importa los datos de acordes y los pasa a un Client Component.
 * @returns {JSX.Element} La página de la biblioteca de acordes.
 */
export default function ChordsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      {/* El contenido se delega a un Client Component para manejar la interactividad (popovers, etc.). */}
      <ChordsPageContent 
          majorChords={majorChords}
          minorChords={minorChords}
          seventhChords={seventhChords}
      />
      <Footer />
    </div>
  );
}
