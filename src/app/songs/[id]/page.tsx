import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { mockSongs } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const song = mockSongs.find(s => s.id === parseInt(params.id));

  if (!song) {
    return {
      title: "Song Not Found",
    }
  }

  return {
    title: `${song.title} by ${song.artist} | Rangel Guitar Hub`,
    description: `Learn to play ${song.title} on guitar with chords and lyrics.`,
  }
}

export default function SongPage({ params }: { params: { id: string } }) {
  const song = mockSongs.find(s => s.id === parseInt(params.id));

  if (!song) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card className="overflow-hidden">
              <Image
                src={song.coverArt}
                alt={`Cover art for ${song.title}`}
                width={600}
                height={600}
                className="aspect-square object-cover w-full"
                data-ai-hint="guitar music"
              />
              <CardHeader>
                <CardTitle className="text-2xl">{song.title}</CardTitle>
                <CardDescription>{song.artist}</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Tabs defaultValue="chords" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chords">Chords</TabsTrigger>
                <TabsTrigger value="lyrics">Lyrics</TabsTrigger>
              </TabsList>
              <TabsContent value="chords">
                <Card>
                  <CardContent className="p-6">
                    <pre className="whitespace-pre-wrap font-code text-sm leading-relaxed text-foreground">
                      {song.chords}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="lyrics">
                <Card>
                  <CardContent className="p-6">
                    <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed text-foreground">
                      {song.lyrics}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
