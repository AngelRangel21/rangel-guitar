'use server';

import { songWriter, type SongWriterOutput } from '@/ai/flows/song-writer-flow';
import { SongWriterInputSchema } from '@/ai/schemas/song-writer-schemas';
import { z } from 'zod';

export async function generateSongAction(
    data: z.infer<typeof SongWriterInputSchema>
): Promise<{ song: SongWriterOutput | null; error?: string }> {
    const validatedData = SongWriterInputSchema.safeParse(data);

    if (!validatedData.success) {
        return { song: null, error: 'Invalid input data.' };
    }

    try {
        const song = await songWriter(validatedData.data);
        return { song };
    } catch (error) {
        console.error("Error generating song:", error);
        return { song: null, error: 'Failed to generate song. Please try again later.' };
    }
}
