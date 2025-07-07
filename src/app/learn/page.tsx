import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LearnPageContent } from "@/components/learn-page-content";
import type { Metadata } from 'next';

/**
 * Metadatos para la página principal de "Aprender".
 * Crucial para SEO y cómo se muestra la página al compartirla.
 */
export const metadata: Metadata = {
  title: 'Aprender',
  description: 'Explora nuestras herramientas y lecciones para mejorar tus habilidades musicales en Rangel Guitar.',
  openGraph: {
    title: 'Aprende Música con Rangel Guitar',
    description: 'Explora nuestras herramientas y lecciones para mejorar tus habilidades musicales en Rangel Guitar.',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: 'Aprende música en Rangel Guitar',
      },
    ],
  },
}

/**
 * Página principal de la sección "Aprender".
 * Funciona como un centro de acceso a las diferentes herramientas de aprendizaje.
 * @returns {JSX.Element} La página de "Aprender".
 */
export default function LearnPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      {/* Componente que renderiza el contenido principal, como las tarjetas de las herramientas. */}
      <LearnPageContent />
      <Footer />
    </div>
  );
}
