'use server';
/**
 * @fileOverview An AI flow to synchronize an audio file with its lyrics and chords.
 *
 * - synchronizeLyrics - A function that handles the lyric synchronization process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  SynchronizeLyricsInput,
  SynchronizeLyricsInputSchema,
  SynchronizeLyricsOutput,
  SynchronizeLyricsOutputSchema
} from '../schemas/lyric-synchronizer-schemas';

export async function synchronizeLyrics(input: SynchronizeLyricsInput): Promise<SynchronizeLyricsOutput> {
  return lyricSynchronizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'lyricSynchronizerPrompt',
  input: {schema: SynchronizeLyricsInputSchema},
  output: {schema: SynchronizeLyricsOutputSchema},
  prompt: `You are an expert audio analyst specializing in music transcription and timing.
Your task is to analyze the provided audio file and the accompanying lyrics with chords.
For each line of the lyrics, you must determine the precise start and end time in seconds from the beginning of the audio file.

The output should be an array of objects, where each object represents a line of the song and contains the line's text, its start time, and its end time.

Example for a line: { "line": "[Verse 1]", "startTime": 15.2, "endTime": 17.0 }
Another example: { "line": "C           G", "startTime": 17.1, "endTime": 19.5 }

Lyrics to analyze:
{{{lyricsWithChords}}}

Audio file to analyze: {{media url=audioDataUri}}`,
});

const lyricSynchronizerFlow = ai.defineFlow(
  {
    name: 'lyricSynchronizerFlow',
    inputSchema: SynchronizeLyricsInputSchema,
    outputSchema: SynchronizeLyricsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
