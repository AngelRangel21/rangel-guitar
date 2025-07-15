'use server';
/**
 * @fileOverview An AI flow to analyze an audio file and determine its chord progression.
 *
 * - analyzeSong - A function that handles the song analysis process.
 * - AnalyzeSongInput - The input type for the analyzeSong function.
 * - AnalyzeSongOutput - The return type for the analyzeSong function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzeSongInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "An audio file of a song, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeSongInput = z.infer<typeof AnalyzeSongInputSchema>;

export const AnalyzeSongOutputSchema = z.object({
  chords: z
    .string()
    .describe(
      'The chord progression of the song. For example: "[Intro]\\nC G Am F\\n\\n[Verse 1]\\nC G Am F\\n..."'
    ),
});
export type AnalyzeSongOutput = z.infer<typeof AnalyzeSongOutputSchema>;

export async function analyzeSong(input: AnalyzeSongInput): Promise<AnalyzeSongOutput> {
  return songAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'songAnalyzerPrompt',
  input: {schema: AnalyzeSongInputSchema},
  output: {schema: AnalyzeSongOutputSchema},
  prompt: `You are an expert musician with perfect pitch. Analyze the provided audio file and determine the chord progression of the song.

Format the output clearly, using section markers like [Intro], [Verse], [Chorus], etc., where appropriate.

Audio file to analyze: {{media url=audioDataUri}}`,
});

const songAnalyzerFlow = ai.defineFlow(
  {
    name: 'songAnalyzerFlow',
    inputSchema: AnalyzeSongInputSchema,
    outputSchema: AnalyzeSongOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
