
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CircleOfFifths } from "@/components/circle-of-fifths";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Círculo de Quintas Interactivo',
  description: 'Explora las relaciones entre tonalidades musicales con nuestro círculo de quintas interactivo. Una herramienta esencial para compositores y estudiantes de música.',
}

export default function CircleOfFifthsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
        <CircleOfFifths />
      </main>
      <Footer />
    </div>
  );
}
