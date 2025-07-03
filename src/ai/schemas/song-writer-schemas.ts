import { z } from 'zod';

export const SongWriterInputSchema = z.object({
  topic: z.string().describe('The topic or theme for the song.'),
  genre: z.string().describe('The musical genre for the song.'),
});
export type SongWriterInput = z.infer<typeof SongWriterInputSchema>;

export const SongWriterOutputSchema = z.object({
  title: z.string().describe('The generated title of the song.'),
  artist: z.string().describe('The artist of the song, which should be "AI Composer" or its translation.'),
  chords: z
    .string()
    .describe(
      'The generated lyrics and chords of the song. The chords should be placed above the lyrics, enclosed in square brackets where they should be played. e.g., [C]... [G]... '
    ),
});
export type SongWriterOutput = z.infer<typeof SongWriterOutputSchema>;
