import {z} from 'genkit';

/**
 * @fileOverview Schemas for the lyric synchronizer flow.
 */

export const TimedLineSchema = z.object({
  line: z.string().describe('The line of text, including chords or section markers.'),
  startTime: z.number().describe('The start time of the line in seconds.'),
  endTime: z.number().describe('The end time of the line in seconds.'),
});
export type TimedLine = z.infer<typeof TimedLineSchema>;

export const SynchronizeLyricsInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "An audio file of a song, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  lyricsWithChords: z
    .string()
    .describe('The full text of the lyrics and chords for the song.'),
});
export type SynchronizeLyricsInput = z.infer<typeof SynchronizeLyricsInputSchema>;

export const SynchronizeLyricsOutputSchema = z.object({
  timedLines: z.array(TimedLineSchema).describe('An array of synchronized lyric lines with their start and end times.'),
});
export type SynchronizeLyricsOutput = z.infer<typeof SynchronizeLyricsOutputSchema>;
