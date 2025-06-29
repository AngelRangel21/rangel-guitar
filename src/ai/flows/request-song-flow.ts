'use server';
/**
 * @fileOverview A flow to handle song requests from users.
 *
 * - requestSong - A function that handles the song request process.
 * - RequestSongInput - The input type for the requestSong function.
 * - RequestSongOutput - The return type for the requestSong function.
 */

import {ai} from '@/ai/genkit';
import { addSongRequest } from '@/services/requests-service';
import {z} from 'zod';

const RequestSongInputSchema = z.object({
  title: z.string().describe("The title of the song being requested."),
  artist: z.string().describe("The artist of the song being requested."),
});
export type RequestSongInput = z.infer<typeof RequestSongInputSchema>;

const RequestSongOutputSchema = z.object({
  message: z.string().describe("A confirmation message to the user."),
});
export type RequestSongOutput = z.infer<typeof RequestSongOutputSchema>;

export async function requestSong(input: RequestSongInput): Promise<RequestSongOutput> {
  return requestSongFlow(input);
}

const requestSongFlow = ai.defineFlow(
  {
    name: 'requestSongFlow',
    inputSchema: RequestSongInputSchema,
    outputSchema: RequestSongOutputSchema,
  },
  async (input) => {
    await addSongRequest(input);
    
    return {
      message: `¡Tu solicitud para "${input.title}" ha sido enviada! La revisaremos pronto.`
    };
  }
);
