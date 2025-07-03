import { z } from 'zod';

export const LyricAssistantInputSchema = z.object({
  topic: z.string().describe('The topic or theme for the song.'),
  genre: z.string().describe('The musical genre for the song.'),
  originalLyrics: z.string().optional().describe('The full original lyrics to be refined.'),
  selectedText: z.string().optional().describe('The specific portion of the lyrics the user has selected to change.'),
  instruction: z.string().optional().describe('The user\'s instruction on how to change the selected text.'),
});
export type LyricAssistantInput = z.infer<typeof LyricAssistantInputSchema>;

export const LyricAssistantOutputSchema = z.object({
  lyrics: z.string().describe('The generated or refined lyrics.'),
});
export type LyricAssistantOutput = z.infer<typeof LyricAssistantOutputSchema>;
