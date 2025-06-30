'use server';
/**
 * @fileOverview A flow to handle song requests from users.
 *
 * - requestSong - A function that handles the song request process.
 * - RequestSongInput - The input type for the requestSong function.
 * - RequestSongOutput - The return type for the requestSong function.
 */

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
  const parsedInput = RequestSongInputSchema.safeParse(input);
  
  if (!parsedInput.success) {
    throw new Error('Invalid song request data.');
  }

  await addSongRequest(parsedInput.data);
  
  return {
    message: `¡Tu solicitud para "${input.title}" ha sido enviada! La revisaremos pronto.`
  };
}
