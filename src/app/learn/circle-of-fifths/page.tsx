
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CircleOfFifthsWrapper } from "@/components/circle-of-fifths-wrapper";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Círculo de Quintas Interactivo',
  description: 'Explora las relaciones entre tonalidades musicales con nuestro círculo de quintas interactivo. Una herramienta esencial para compositores y estudiantes de música.',
  openGraph: {
    title: 'Círculo de Quintas Interactivo | Rangel Guitar',
    description: 'Explora las relaciones entre tonalidades con el Círculo de Quintas de Rangel Guitar.',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: 'Círculo de Quintas de Rangel Guitar',
      },
    ],
  },
}

export default function CircleOfFifthsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
        <CircleOfFifthsWrapper />
      </main>
      <Footer />
    </div>
  );
}
