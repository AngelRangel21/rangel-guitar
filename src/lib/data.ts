import type { Song } from "@/lib/types";

export const mockSongs: Song[] = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  title: `Guitar Ballad No. ${i + 1}`,
  artist: `Musician ${Math.floor(i / 5) + 1}`,
  coverArt: `https://placehold.co/400x400.png?a=${i}`,
  lyrics: `[Verse 1]
The sun is setting low
A gentle, evening glow
I pick my old guitar
And play beneath a star

[Chorus]
Oh, this simple tune
Beneath the silver moon
A ballad soft and sweet
A rhythm for my feet

[Verse 2]
The chords ring in the air
Without a single care
A melody so fine
A feeling so divine

[Chorus]
Oh, this simple tune
Beneath the silver moon
A ballad soft and sweet
A rhythm for my feet`,
  chords: `[Intro]
G  C  G  D

[Verse 1]
G               C
The sun is setting low
G               D
A gentle, evening glow
G               C
I pick my old guitar
G          D    G
And play beneath a star

[Chorus]
C           G
Oh, this simple tune
D           G
Beneath the silver moon
C           G
A ballad soft and sweet
D             G
A rhythm for my feet`,
}));
