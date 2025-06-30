'use server';
/**
 * @fileOverview A flow to handle song requests from users.
 *
 * - requestSong - A function that handles the song request process.
 * - RequestSongInput - The input type for the requestSong function.
 * - RequestSongOutput - The return type for the requestSong function.
 */

import { addSongRequest } from '@/services/requests-service';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

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
  // This exported function is the wrapper that the client-side code will call.
  // It invokes the actual Genkit flow.
  return requestSongFlow(input);
}

const requestSongFlow = ai.defineFlow(
  {
    name: 'requestSongFlow',
    inputSchema: RequestSongInputSchema,
    outputSchema: RequestSongOutputSchema,
  },
  async (input) => {
    // Genkit automatically validates the input against the schema,
    // so no need for manual validation here.
    
    // Call the service to add the song request.
    await addSongRequest(input);
    
    // Return a success message.
    return {
      message: `¡Tu solicitud para "${input.title}" ha sido enviada! La revisaremos pronto.`
    };
  }
);
