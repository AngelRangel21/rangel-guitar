
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { EarTrainer } from "@/components/ear-trainer";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entrenador de Oído',
  description: 'Mejora tu oído musical identificando notas. Una herramienta divertida y efectiva para guitarristas de todos los niveles.',
  openGraph: {
    title: 'Entrenador de Oído | Rangel Guitar',
    description: 'Mejora tu oído musical con el entrenador de Rangel Guitar.',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: 'Entrenador de Oído de Rangel Guitar',
      },
    ],
  },
}

export default function EarTrainerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
        <EarTrainer />
      </main>
      <Footer />
    </div>
  );
}
