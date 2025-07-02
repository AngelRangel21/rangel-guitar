'use server';
/**
 * @fileOverview A flow to generate a song with lyrics and chords based on a user's prompt.
 *
 * - songWriter - A function that handles the song creation process.
 * - SongWriterInput - The input type for the songWriter function.
 * - SongWriterOutput - The return type for the songWriter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

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


export async function songWriter(input: SongWriterInput): Promise<SongWriterOutput> {
  return songWriterFlow(input);
}


const prompt = ai.definePrompt({
    name: 'songWriterPrompt',
    input: {schema: SongWriterInputSchema},
    output: {schema: SongWriterOutputSchema},
    prompt: `You are an expert songwriter and musician. Your task is to compose a new, original song based on the user's request.

    The song should have a clear structure (e.g., Verse, Chorus, Bridge, Outro).
    You must provide both the lyrics and the chord progression.
    Place the chord symbols in square brackets [ ] directly above the syllable where the chord change occurs.
    The chords should be simple and suitable for a beginner to intermediate guitar player.

    The user wants a song about: {{{topic}}}
    The desired genre is: {{{genre}}}

    Your output must be a JSON object that strictly follows the provided schema. The "artist" field should be "AI Composer".
    `,
});

const songWriterFlow = ai.defineFlow(
    {
      name: 'songWriterFlow',
      inputSchema: SongWriterInputSchema,
      outputSchema: SongWriterOutputSchema,
    },
    async (input) => {
      const {output} = await prompt(input);
      return output!;
    }
);
