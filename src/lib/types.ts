export type Song = {
  id: string;
  title: string;
  artist: string;
  coverArt: string;
  lyrics?: string;
  chords?: string;
  video?: string;
  visitCount: number;
  likeCount: number;
};
