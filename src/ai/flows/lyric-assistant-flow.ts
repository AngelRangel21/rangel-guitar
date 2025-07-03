'use server';
/**
 * @fileOverview A flow to generate and refine song lyrics.
 *
 * - lyricAssistant - A function that handles lyric creation and refinement.
 * - LyricAssistantInput - The input type for the lyricAssistant function.
 * - LyricAssistantOutput - The return type for the lyricAssistant function.
 */

import {ai} from '@/ai/genkit';
import {
    LyricAssistantInputSchema,
    LyricAssistantOutputSchema,
    type LyricAssistantInput,
    type LyricAssistantOutput,
} from '@/ai/schemas/lyric-assistant-schemas';

export type { LyricAssistantInput, LyricAssistantOutput };

export async function lyricAssistant(input: LyricAssistantInput): Promise<LyricAssistantOutput> {
  return lyricAssistantFlow(input);
}


const prompt = ai.definePrompt({
    name: 'lyricAssistantPrompt',
    input: {schema: LyricAssistantInputSchema},
    output: {schema: LyricAssistantOutputSchema},
    prompt: `You are a professional songwriter and lyricist. Your output must be a JSON object with a single "lyrics" field.

    {{#if instruction}}
    A user has provided a selection from existing lyrics and an instruction to refine them.
    Your task is to rewrite ONLY the selected portion of the lyrics according to the instruction, and then integrate the rewritten part back into the full original lyrics seamlessly.
    The final output should be the complete, updated lyrics. Do not add any extra commentary or prose. Just return the full lyrics with the change.

    Full Original Lyrics:
    {{{originalLyrics}}}

    Selected Text to Refine:
    "{{{selectedText}}}"

    Instruction for Refinement:
    "{{{instruction}}}"
    {{else}}
    Your task is to write a new, original song based on the user's request.
    The song should have a clear structure (e.g., [Verse 1], [Chorus], [Verse 2], [Chorus], [Bridge], [Outro]).
    The lyrics should be creative and fit the specified genre.

    User's Topic: {{{topic}}}
    Desired Genre: {{{genre}}}
    {{/if}}
    `,
});

const lyricAssistantFlow = ai.defineFlow(
    {
      name: 'lyricAssistantFlow',
      inputSchema: LyricAssistantInputSchema,
      outputSchema: LyricAssistantOutputSchema,
    },
    async (input) => {
      const {output} = await prompt(input);
      return output!;
    }
);
