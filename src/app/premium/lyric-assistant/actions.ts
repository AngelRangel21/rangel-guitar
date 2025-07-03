'use server';

import { lyricAssistant } from '@/ai/flows/lyric-assistant-flow';
import { LyricAssistantInputSchema } from '@/ai/schemas/lyric-assistant-schemas';
import { z } from 'zod';

export async function lyricAssistantAction(
    data: z.infer<typeof LyricAssistantInputSchema>
): Promise<{ lyrics: string | null; error?: string }> {
    const validatedData = LyricAssistantInputSchema.safeParse(data);

    if (!validatedData.success) {
        return { lyrics: null, error: 'Invalid input data.' };
    }

    try {
        const result = await lyricAssistant(validatedData.data);
        return { lyrics: result.lyrics };
    } catch (error) {
        console.error("Error in lyric assistant action:", error);
        return { lyrics: null, error: 'Failed to process request. Please try again later.' };
    }
}
