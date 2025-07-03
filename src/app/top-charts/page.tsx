import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getTopSongsBy } from "@/services/songs-service";
import { TopChartsContent } from "@/components/top-charts-content";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Top Canciones',
  description: 'Descubre las canciones más populares y con más me gusta en Rangel Guitar.',
}

export default async function TopChartsPage() {
    const TOP_COUNT = 10;

    const topVisited = await getTopSongsBy('visitCount', TOP_COUNT);
    const topLiked = await getTopSongsBy('likeCount', TOP_COUNT);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <TopChartsContent topVisited={topVisited} topLiked={topLiked} />
            </main>
            <Footer />
        </div>
    );
}
