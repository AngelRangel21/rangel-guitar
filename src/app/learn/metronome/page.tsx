import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Metronome } from "@/components/metronome";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Herramienta de Metrónomo',
  description: 'Usa nuestro metrónomo interactivo para practicar tu tempo y ritmo. Ajusta los BPM y el compás para adaptarlo a tus necesidades de práctica.',
  openGraph: {
    title: 'Metrónomo Interactivo | Rangel Guitar',
    description: 'Practica tu tempo y ritmo con el metrónomo de Rangel Guitar.',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: 'Metrónomo de Rangel Guitar',
      },
    ],
  },
}

export default function MetronomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
        <Metronome />
      </main>
      <Footer />
    </div>
  );
}
