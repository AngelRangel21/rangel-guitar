'use server';
/**
 * @fileOverview An AI flow to analyze an audio file and determine its chord progression.
 *
 * - analyzeSong - A function that handles the song analysis process.
 */

import {ai} from '@/ai/genkit';
import { AnalyzeSongInput, AnalyzeSongInputSchema, AnalyzeSongOutput, AnalyzeSongOutputSchema } from '../schemas/song-analyzer-schemas';


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
