import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getTopSongsBy } from "@/services/songs-service";
import { TopChartsContent } from "@/components/top-charts-content";
import type { Metadata } from 'next';

/**
 * Metadatos para la página de Top Canciones.
 * Esencial para el SEO y para cómo se muestra la página al compartirla.
 */
export const metadata: Metadata = {
  title: 'Top Canciones',
  description: 'Descubre las canciones más populares y con más me gusta en Rangel Guitar.',
  openGraph: {
    title: 'Top Canciones | Rangel Guitar',
    description: 'Descubre las canciones más populares y con más me gusta en Rangel Guitar.',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: 'Top Canciones en Rangel Guitar',
      },
    ],
  },
}

/**
 * Página que muestra las canciones más populares, tanto por visitas como por "me gusta".
 * Es un Server Component que obtiene los datos en tiempo de compilación/servidor.
 * @returns {Promise<JSX.Element>} La página de Top Canciones.
 */
export default async function TopChartsPage() {
    const TOP_COUNT = 10; // Define cuántas canciones mostrar en cada lista.

    // Obtiene las canciones más visitadas y con más "me gusta" desde el servicio.
    const topVisited = await getTopSongsBy('visitCount', TOP_COUNT);
    const topLiked = await getTopSongsBy('likeCount', TOP_COUNT);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 opacity-0 animate-content-in">
                {/* Componente de cliente que renderiza las listas con pestañas. */}
                <TopChartsContent topVisited={topVisited} topLiked={topLiked} />
            </main>
            <Footer />
        </div>
    );
}
