'use server';
/**
 * @fileOverview A flow to generate a song with lyrics and chords based on a user's prompt.
 *
 * - songWriter - A function that handles the song creation process.
 * - SongWriterInput - The input type for the songWriter function.
 * - SongWriterOutput - The return type for the songWriter function.
 */

import {ai} from '@/ai/genkit';
import {
    SongWriterInputSchema,
    SongWriterOutputSchema,
    type SongWriterInput,
    type SongWriterOutput,
} from '@/ai/schemas/song-writer-schemas';

export type { SongWriterInput, SongWriterOutput };

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
