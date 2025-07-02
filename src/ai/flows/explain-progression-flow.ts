'use server';
/**
 * @fileOverview A flow to analyze a song's chord progression.
 *
 * - explainProgression - A function that returns a music theory explanation for a set of chords.
 * - ExplainProgressionInput - The input type for the explainProgression function.
 * - ExplainProgressionOutput - The return type for the explainProgression function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExplainProgressionInputSchema = z.object({
  chords: z.string().describe("The chord sheet of the song to be analyzed."),
});
export type ExplainProgressionInput = z.infer<typeof ExplainProgressionInputSchema>;

const ExplainProgressionOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      "A beginner-friendly music theory explanation of the chord progression. Should identify the key and common patterns."
    ),
});
export type ExplainProgressionOutput = z.infer<typeof ExplainProgressionOutputSchema>;

export async function explainProgression(input: ExplainProgressionInput): Promise<ExplainProgressionOutput> {
  return explainProgressionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainProgressionPrompt',
  input: { schema: ExplainProgressionInputSchema },
  output: { schema: ExplainProgressionOutputSchema },
  prompt: `You are a friendly and encouraging music theory teacher. Your goal is to explain the chord progression of a song to a beginner guitarist in a simple and clear way.

Analyze the provided chord progression. Identify the most likely key of the song. Explain the main chord progression using Roman numerals (e.g., I-V-vi-IV). 

Keep the explanation concise, under 150 words, and easy to understand for someone with little to no music theory knowledge. Start by stating the key of the song.

Chord Progression:
{{{chords}}}
`,
});

const explainProgressionFlow = ai.defineFlow(
  {
    name: 'explainProgressionFlow',
    inputSchema: ExplainProgressionInputSchema,
    outputSchema: ExplainProgressionOutputSchema,
  },
  async (input) => {
    // Return an empty explanation if the chord string is empty or just whitespace
    if (!input.chords?.trim()) {
      return { explanation: "No chords provided to analyze." };
    }
    
    const { output } = await prompt(input);
    return output!;
  }
);
