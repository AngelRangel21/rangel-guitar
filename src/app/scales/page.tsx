import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScalesPageContent } from "@/components/scales-page-content";
import { rootNotes, scaleTypes } from "@/lib/scales-data";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Biblioteca de Escalas',
  description: 'Explora y aprende escalas musicales para guitarra y teclado. Encuentra todas las escalas mayores y menores.',
}

export default function ScalesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <ScalesPageContent rootNotes={rootNotes} scaleTypes={scaleTypes} />
      <Footer />
    </div>
  );
}
