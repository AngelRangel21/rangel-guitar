
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { EarTrainer } from "@/components/ear-trainer";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entrenador de Oído',
  description: 'Mejora tu oído musical identificando notas. Una herramienta divertida y efectiva para guitarristas de todos los niveles.',
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
