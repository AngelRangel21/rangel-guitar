import {z} from 'genkit';

/**
 * @fileOverview Schemas for the song analyzer flow.
 *
 * - AnalyzeSongInputSchema - The Zod schema for the input.
 * - AnalyzeSongInput - The TypeScript type for the input.
 * - AnalyzeSongOutputSchema - The Zod schema for the output.
 * - AnalyzeSongOutput - The TypeScript type for the output.
 */

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
  lyrics: z.string().describe("The full lyrics of the song."),
});
export type AnalyzeSongOutput = z.infer<typeof AnalyzeSongOutputSchema>;
