import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LearnPageContent } from "@/components/learn-page-content";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aprender',
  description: 'Explora nuestras herramientas y lecciones para mejorar tus habilidades musicales en Rangel Guitar.',
}

export default function LearnPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <LearnPageContent />
      <Footer />
    </div>
  );
}
