import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { majorChords, minorChords, seventhChords } from "@/lib/chords-data";
import { ChordsPageContent } from "@/components/chords-page-content";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Biblioteca de Acordes',
  description: 'Explora una biblioteca completa de acordes de guitarra. Encuentra diagramas para acordes mayores, menores y de séptima para mejorar tu forma de tocar.',
}

export default function ChordsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <ChordsPageContent 
          majorChords={majorChords}
          minorChords={minorChords}
          seventhChords={seventhChords}
      />
      <Footer />
    </div>
  );
}
